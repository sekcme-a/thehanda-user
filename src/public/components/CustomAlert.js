import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


/**
  const [customAlert, setCustomAlert] = useState({
    title:"",
    content:"",
    open: false,
    type:"",
    result: true,  //confirm()기능 결과
  })
 */
export default function CustomAlert({alert, setAlert}) {


  const handleClose = (result) => {
    setAlert({...alert, "open": false, result:result})
  };

  const onCancelClick = () => {
    handleClose(false)
  }

  const onConfirmClick = () => {
    if(alert.type==="confirm")
      handleClose(true)
    else
      handleClose()
  }

  return (
    <>
      <Dialog
        open={alert.open}
        onClose={handleClose}
      >
        <div style={{padding: "10px 20px"}}>
          <div style={{fontSize:"18px"}}>
            {alert.title}
          </div>
          <div style={{fontSize:"16px", marginTop:"10px", whiteSpace:"pre-line", wordBreak:"keep-all", lineHeight:"1.3"}}>
            {alert.content}
          </div>
            <div style={{display:"flex", justifyContent:"right", marginTop:"10px"}}>
              {alert.type==="confirm" &&
                <div onClick={onCancelClick} style={{color:"#444", padding: "5px 7px", fontSize:"15px", marginRight:"10px"}}>취소</div>
              }
              <div onClick={onConfirmClick} autoFocus style={{color:"#814ad8", padding: "5px 7px", fontSize:"15px"}}>
                확인
              </div>
            </div>
          </div>
      </Dialog>
    </>
  );
}