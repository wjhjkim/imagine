# Imagine

---

잊고 있던 추억들, 사진과 함께 떠올려보세요!

## 프로젝트 개요

---

> **"사진은 단지 이미지가 아니라, 마음 속의 기억을 간직하는 방법이다."** - 미나 테런스
> 

사진은 눈에 보이는 풍경을 담아 보여주는 저장 매체입니다. 또한 사람들은 이따금 자신이 찍은 사진을 보며 찍을 때의 기억을 떠올리곤 합니다. 이런 점에서 사진은 단순한 저장 매체가 아닌 사람들의 기억을 상징하는 메타포로 기능하게 됩니다.

이 웹페이지는 구글 사진과의 연동을 통해 자신의 사진을 무작위로 다양한 효과를 통해 보여줍니다. 제작자가 선정한 노래들과 함께 자신의 기억을 담은 사진들이 익숙하지 않은 화면 효과를 통해 그림처럼 그려지는 과정을 보며 사진을 찍을 때의 기억을 천천히 되짚어볼 수 있습니다.

이 프로젝트가 사람들이 잊고 있던 소중한 기억을 떠올리는 계기가 되기를 바랍니다.

기술 스택: Front: React. Back: Node.js

## 팀원 소개

---

- 연세대학교 화공생명공학부 22학번 김수환: [김수환](https://github.com/Jannare)
- 카이스트 전산학부 20학번 김원중: [김원중](https://github.com/wjhjkim)

## 프로젝트 소개

---

### 0. 인트로 페이지

- 제작자가 선정한 노래 플레이리스트의 시작과 함께 로고 애니메이션이 시작됩니다.
- 로고 애니메이션이 끝난 뒤 로고를 눌러 모드 선택 페이지로 들어갈 수 있습니다.

https://github.com/user-attachments/assets/7fb8327b-e402-47f9-9b78-5234d86c3191

### 1. 모드 선택 페이지

- 제작자의 샘플 사진과 사용자의 구글 사진 모드를 선택할 수 있습니다.
    - 제작자 사진 모드를 선택할 경우 제작자가 선정한 사진들로 2번 이후의 페이지들이 전개됩니다.
    - 사용자 사진 모드를 선택할 경우 사용자의 구글 포토의 사진들로 2번 이후의 페이지들이 전개됩니다.

https://github.com/user-attachments/assets/f726f0e1-cb1d-43dc-99e7-cbaf61ea504a

### 2. 사진 선택 페이지

- 고른 모드를 통해 가져온 사진들을 랜덤으로 화면에 띄어 줍니다.
- 사용자는 원하는 사진을 눌러 그 사진을 전체 화면에 띄울 수 있습니다.

https://github.com/user-attachments/assets/dc110c0c-d509-48bd-a564-b439fbe48b1d

### 3. 상세 효과 페이지

- 선택된 사진을 화면에 다양한 효과로 그려 줍니다.
    - 8가지 효과 중 랜덤으로 선택됩니다.
        1. 폭발 효과
            
            <img src= https://github.com/user-attachments/assets/c81f1160-e5a9-468f-9ac0-dc018b971aba width="200" height="400"/>
            
        2. 수채화 효과
            
            <img src= https://github.com/user-attachments/assets/f6cd2b20-fa2c-416f-aa66-0dbe6d2bdf6d width="200" height="400"/>
            
        3. 픽셀화 효과
            
            <img src= https://github.com/user-attachments/assets/1c51e212-736c-48c1-808e-66dba9b8c5ab width="200" height="400"/>
            
        4. 선 효과: 무작위 배열
            
            <img src= https://github.com/user-attachments/assets/c238276e-9099-4a99-b95d-6b4c86587de9 width="200" height="400"/>
            
        5. 선 효과: 파도 배열
            
            <img src= https://github.com/user-attachments/assets/b0e22fe4-b3e8-4feb-b247-ab76b1750d1d width="200" height="400"/>
            
        6. 선 효과: 직선 배열
            
            <img src= https://github.com/user-attachments/assets/62cefbc0-d172-4c55-b684-f3c990acfbca width="200" height="400"/>
            
        7. 빗물 효과
            
            <img src= https://github.com/user-attachments/assets/71e398da-b900-4119-b821-72c3b35629b4 width="200" height="400"/>
            
        8. 점묘화 효과
            
            <img src= https://github.com/user-attachments/assets/8405a7e5-c9ef-42da-b2e7-157da0e871a2 width="200" height="400"/>
            
- 효과가 끝난 뒤 약 1초 후 화면이 지워진 이후 다른 효과로 넘어가게 됩니다.
