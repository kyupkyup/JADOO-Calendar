# 🍒 자두 먼슬리 캘린더 (20210619 ~ 20210625)

## [배포](https://github.com/HyunJungC-Dev/JADOO-Calendar)

## 팀 자두 구성 및 역할 분담
+ [조현정](https://github.com/HyunJungC-Dev) : 깃 관리, (JS) 각 요소의 drag and drop 기능 구현
+ [이경엽](https://github.com/kyupkyup) : 발표자료 & 기획, (JS)달력의 무한 스크롤 기능 구현
+ [차유림](https://github.com/chacha912) : 프로토타입디자인, (JS)커스텀 Select box 키보드 이벤트 기능 구현

## Pull Request Convention
```FEATURE_NAME(이름 이니셜)-날짜```
+ FEATURE_NAME은 camelCase를 사용
+ 날짜는 6자리로 통일
+ 예시) dragEvent(CHJ)-210621

## 프로젝트 관리
### 1. git flow 사용
+ git flow 최초 사용 시 
```
$ git flow init
```
+ 이후, 각 특정한 기능을 개발하기 위한 branch 생성
```
$ git flow feature start <branch name>
```
+ 해당 기능 개발 완료 후 branch merge
```
$ git flow feature finish <branch name>
```

## 코딩 컨벤션
