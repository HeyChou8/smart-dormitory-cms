import styled from "styled-components";

export const MainWrapper =  styled.div`
    .main_content {
        transition: margin-left .3s ease,width .3s ease ;
    }
    
    .logo {
        display: flex;
        height: 1.8229vw;
         padding: 0.7813vw 0.651vw 0.5208vw 0.651vw;
         flex-direction: row;
         justify-content: flex-start;
         align-items: center;
         overflow: hidden;
         transition: margin-left .2s ease ;
        margin: 0.9766vw 0;
        .title {
            font-size: 1.0417vw;
            font-weight: 700;
            color: white;
            white-space: nowrap;
        }
        .img {
    height: 1.4323vw;
    
  }
    }
`