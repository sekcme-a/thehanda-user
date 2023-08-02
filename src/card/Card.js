import Flippy, { FrontSide, BackSide } from 'react-flippy';
import React, { useRef } from 'react';
import Image from 'next/image';
import styles from "./Card.module.css"

const Card = () => {
  const flippyRef = useRef(null);

  const handleToggle = () => {
    if (flippyRef.current) {
      flippyRef.current.toggle();
    }
  };

  return (
    <Flippy
      flipOnHover={false} // default false
      flipOnClick={true} // default false
      flipDirection="horizontal" // horizontal or vertical
      ref={flippyRef}
      // style={{width:"70vw", display: "block", padding:"0", margin:"0"}}
      // style={{width:"100%", height:"100%", display: "flex", justifyContent:"center", alignItems:"center"}} // these are optional style, it is not necessary
    >
      <FrontSide
        style={{
          padding:"0",
          backgroundColor:"none",
          boxShadow:"none",
          margin:"0",
        }}
      >
        <div className={styles.img_container}>
          <h1>{`${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, '0')}.${String(new Date().getDate()).padStart(2, '0')}`}</h1>
          <Image src="/card/basic_front.png" layout="responsive" width={232} height={365} alt="basic card"/>
        </div>
      </FrontSide>
      <BackSide         
        style={{
        padding:"0",
        backgroundColor:"none",
        boxShadow:"none",
        margin:"0",
      }}>
        <div className={styles.img_container}>
          <Image src="/card/basic_back.png" layout="responsive" width={232} height={365} alt="basic card"/>
        </div>
      </BackSide>
    </Flippy>
  );
};

export default Card;
