import styled from 'styled-components';
// 使用styled-components定义样式
export const CenterAvatarWrapper = styled.div`
  .center_avatar {
    display: flex;
    align-items: center;
    margin-bottom: 1.3021vw;
    margin-left:1.3021vw;
    .avatar_info {
      display: flex;
      align-items: center;
      
      .avatar {
        margin-right: 1.3021vw;
        
      }
      .upload_text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 0.651vw;
        .text {
          margin-top: 0.2604vw;
          font-size: 0.7813vw;
          color: rgb(5 5 5 / 38%);
        }
      }
    }
  }
`;