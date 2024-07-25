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

전체 시연 영상

https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/ea733ceb-180d-4319-b4c3-16ba912bc930/%EC%8B%9C%EC%97%B0%EC%98%81%EC%83%81_%ED%92%80%EC%98%81%EC%83%81.mp4

## 팀원 소개

---

- 연세대학교 화공생명공학부 22학번 김수환: [김수환](https://github.com/Jannare)
- 카이스트 전산학부 20학번 김원중: [김원중](https://github.com/wjhjkim)

## 프로젝트 소개

---

### 0. 인트로 페이지

- 제작자가 선정한 노래 플레이리스트의 시작과 함께 로고 애니메이션이 시작됩니다.
- 로고 애니메이션이 끝난 뒤 로고를 눌러 모드 선택 페이지로 들어갈 수 있습니다.

https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/841f56bd-9725-452e-8b86-e56106967aac/%EC%8B%9C%EC%97%B0%EC%98%81%EC%83%81_%EC%9D%B8%ED%8A%B8%EB%A1%9C.mp4

### 1. 모드 선택 페이지

- 제작자의 샘플 사진과 사용자의 구글 사진 모드를 선택할 수 있습니다.
    - 제작자 사진 모드를 선택할 경우 제작자가 선정한 사진들로 2번 이후의 페이지들이 전개됩니다.
    - 사용자 사진 모드를 선택할 경우 사용자의 구글 포토의 사진들로 2번 이후의 페이지들이 전개됩니다.

https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/246007a3-47da-4f39-8cf6-fb5d34bf3451/%EC%8B%9C%EC%97%B0%EC%98%81%EC%83%81_%EB%B2%84%ED%8A%BC.mp4

### 2. 사진 선택 페이지

- 고른 모드를 통해 가져온 사진들을 랜덤으로 화면에 띄어 줍니다.
- 사용자는 원하는 사진을 눌러 그 사진을 전체 화면에 띄울 수 있습니다.

https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/1a85387f-fa37-4dc9-acb0-e25dcce0168e/%EC%8B%9C%EC%97%B0%EC%98%81%EC%83%81_%ED%99%94%EB%A9%B4_%ED%8E%98%EC%9D%B4%EC%A7%80.mp4

### 3. 상세 효과 페이지

- 선택된 사진을 화면에 다양한 효과로 그려 줍니다.
    - 8가지 효과 중 랜덤으로 선택됩니다.
        1. 폭발 효과
            
            <img src= https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/aa48affd-823b-4ac5-a933-309624e48fdd/explotion.jpg width="200" height="400"/>
            
        2. 수채화 효과
            
            <img src= https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/24dce49d-8eb1-45e4-a98d-d68d3603791a/watercolor.jpg width="200" height="400"/>
            
        3. 픽셀화 효과
            
            <img src= https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/f8480779-6ca0-4f4d-aafd-c398c40b8c7c/changecolor.jpg width="200" height="400"/>
            
        4. 선 효과: 무작위 배열
            
            <img src= https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/bf8e4b66-7e3e-4d96-a78f-564b4edfe451/line.jpg width="200" height="400"/>
            
        5. 선 효과: 파도 배열
            
            <img src= https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/2b95c09b-9aae-4939-aa6b-0278f0c3bd46/goodline.jpg width="200" height="400"/>
            
        6. 선 효과: 직선 배열
            
            <img src= https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/83c51649-9dbc-4eb1-be43-8851a246cc1a/greatline.jpg width="200" height="400"/>
            
        7. 빗물 효과
            
            <img src= https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/c57fc714-4b7d-41d6-a0d5-4ca0c09f0b6c/waterfalling.jpg width="200" height="400"/>
            
        8. 점묘화 효과
            
            <img src= https://prod-files-secure.s3.us-west-2.amazonaws.com/f6cb388f-3934-47d6-9928-26d2e10eb0fc/673566f3-4568-49d8-a2f4-c728b7aacfb2/waterripple.jpg width="200" height="400"/>
            
- 효과가 끝난 뒤 약 1초 후 화면이 지워진 이후 다른 효과로 넘어가게 됩니다.
