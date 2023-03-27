import { useEffect, useState } from "react"
import styles from "src/public/form/items.module.css"

import SingleCheckbox from "./items/SingleCheckbox"
import MultipleCheckbox from "./items/MultipleCheckbox"
import ListSelect from "./items/ListSelect"
import NumberSelect from "./items/NumberSelect"
import SmallInput from "./items/SmallInput"
import FreeInput from "./items/FreeInput"
import DateTime from "./items/DateTime"
import PhoneNumber from "./items/PhoneNumber"
import Address from "./items/Address"
import Image from "./items/Image"
import File from "./items/File"
import SelectMultipleChip from "../mui/SelectMultipleChip"
import { firestore as db } from "firebase/firebase"
import useData from "context/data"
import { MobileTimePicker } from "@mui/x-date-pickers"

const Form = ({ formDatas, data, handleData, addMargin, type, setSelectedMembers }) => {
  const {user} = useData()
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [familyData, setFamilyData] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  // useEffect(() => {
  //   console.log(data)
  //   if(type!=="common"){
  //     setData([...data, {id:"selectedMember", value:[]}])
  //   }
  // },[formDatas])

  useEffect(()=>{
    if(type!=="common" && user){
      setIsLoading(true)
      db.collection("user").doc(user.uid).get().then((doc) => {
        const promises = doc.data().family.map((item) => {
          return db.collection("user").doc(item.uid).get()
            .then((itemDoc) => {
              if (itemDoc.exists) {
                return {
                  uid: item.uid,
                  relation: item.relation,
                  displayName: itemDoc.data().displayName,
                  realName: itemDoc.data().realName,
                  phoneNumber: itemDoc.data().phoneNumber
                };
              }
            });
        });
        return Promise.all(promises.filter(Boolean))
          .then((family) => {
            setFamilyData([...family]);
            const temp = family.map(member=>`${member.realName}(${member.displayName})|${member.phoneNumber}`)
            console.log(temp)
            setMembers([...temp])
            setIsLoading(false);
          });
      })
    }
  },[])

  useEffect(()=>{
    const temp = selectedItems.map((item)=>{
      const parts = item.split(/[\(\)]|\s\|\s/g);
      const realName = parts[0];
      const displayName = parts[1];
      const phoneNumber = parts[2];
      for(const member of familyData){
        console.log(member.phoneNumber)
        console.log(phoneNumber)
        if(member.realName===realName && member.displayName === displayName && `|${member.phoneNumber}`===phoneNumber){
          return (member.uid)
        }
      }
    }).filter(Boolean)
    console.log(temp)
    setSelectedMembers([...temp])
    // setSelectedMembers()
  },[selectedItems])
  return (
    <div className={styles.form_container}>
      {(type==="children"||type==="family") && 
      <>
        <div className={styles.single_checkbox_container} >
          <h1 style={{marginBottom:"10px"}}>가족 구성원 선택<p>*필수항목</p></h1>
          <SelectMultipleChip title="가족 구성원 선택" items={members} selectedItems={selectedItems} setSelectedItems={setSelectedItems}/>
        </div>
      </>
      }
      {
        formDatas.map((formData, index) => {
          if (formData.type === "single_checkbox")
            return (
              <>
                <div style={addMargin && { marginBottom: "1px" }} key={index}>
                  <SingleCheckbox index={index}
                    id={formData.id} title={formData.title} items={formData.items}
                    data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
                  />
                </div>

              </>
            )
          else if (formData.type === "multiple_checkbox")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><MultipleCheckbox index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            />{console.log(formData.items)}</div>
          else if (formData.type === "list_select")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><ListSelect index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "number_select")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><NumberSelect index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "small_input")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><SmallInput index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "free_input")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><FreeInput index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "date_time")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><DateTime index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "phone_number")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><PhoneNumber index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "address")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><Address index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "image")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><Image index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
          else if (formData.type === "file")
            return <div style={addMargin && {marginBottom:"1px"}} key={index}><File index={index}
              id={formData.id} title={formData.title} items={formData.items}
              data={data} handleData={handleData} text={formData.text} isRequired={formData.isRequired}
            /></div>
      })}
    </div>
  )
}

export default Form