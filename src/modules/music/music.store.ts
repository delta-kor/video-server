enum AlbumStore {
  COLOR_IZ = 'COLOR*IZ',
  SUKI_TO_IWASETAI = 'Suki To Iwasetai',
  HEART_IZ = 'HEART*IZ',
  BUENOS_AIRES = 'Buenos Aires',
  VAMPIRE = 'Vampire',
  BLOOM_IZ = 'BLOOM*IZ',
  ONEIRIC_DIARY = 'Oneiric Diary',
  TWELVE = 'Twelve',
  ONE_REELER = 'One-reeler',
  ONE_THE_STORY = 'ONE, THE STORY',
}

const MusicStore = new Map<string, AlbumStore>();

MusicStore.set('아름다운 색', AlbumStore.COLOR_IZ);
MusicStore.set("O' My!", AlbumStore.COLOR_IZ);
MusicStore.set('라비앙로즈', AlbumStore.COLOR_IZ);
MusicStore.set('비밀의 시간', AlbumStore.COLOR_IZ);
MusicStore.set('앞으로 잘 부탁해', AlbumStore.COLOR_IZ);
MusicStore.set('반해버리잖아?', AlbumStore.COLOR_IZ);
MusicStore.set('꿈을 꾸는 동안', AlbumStore.COLOR_IZ);
MusicStore.set('내꺼야', AlbumStore.COLOR_IZ);
MusicStore.set('Rumor', AlbumStore.COLOR_IZ);

MusicStore.set('Suki to Iwasetai', AlbumStore.SUKI_TO_IWASETAI);
MusicStore.set('춤이 생각날 때까지', AlbumStore.SUKI_TO_IWASETAI);

MusicStore.set('해바라기', AlbumStore.HEART_IZ);
MusicStore.set('비올레타', AlbumStore.HEART_IZ);
MusicStore.set('Highlight', AlbumStore.HEART_IZ);
MusicStore.set('Really Like You', AlbumStore.HEART_IZ);
MusicStore.set('Airplane', AlbumStore.HEART_IZ);
MusicStore.set('하늘 위로', AlbumStore.HEART_IZ);
MusicStore.set('고양이가 되고 싶어', AlbumStore.HEART_IZ);
MusicStore.set('기분 좋은 안녕', AlbumStore.HEART_IZ);

MusicStore.set('Buenos Aires', AlbumStore.BUENOS_AIRES);
MusicStore.set('年下Boyfriend', AlbumStore.BUENOS_AIRES);

MusicStore.set('Vampire', AlbumStore.VAMPIRE);

MusicStore.set('FIESTA', AlbumStore.BLOOM_IZ);
MusicStore.set('DREAMLIKE', AlbumStore.BLOOM_IZ);
MusicStore.set('AYAYAYA', AlbumStore.BLOOM_IZ);
MusicStore.set('SO CURIOUS', AlbumStore.BLOOM_IZ);
MusicStore.set('SPACESHIP', AlbumStore.BLOOM_IZ);
MusicStore.set('우연이 아니야', AlbumStore.BLOOM_IZ);
MusicStore.set('YOU & I', AlbumStore.BLOOM_IZ);
MusicStore.set('DAYDREAM', AlbumStore.BLOOM_IZ);
MusicStore.set('PINK BLUSHER', AlbumStore.BLOOM_IZ);
MusicStore.set('언젠가 우리의 밤도 지나가겠죠', AlbumStore.BLOOM_IZ);
MusicStore.set('OPEN YOUR EYES', AlbumStore.BLOOM_IZ);

MusicStore.set('Beware', AlbumStore.TWELVE);

MusicStore.set('Welcome', AlbumStore.ONEIRIC_DIARY);
MusicStore.set('환상동화', AlbumStore.ONEIRIC_DIARY);
MusicStore.set('Pretty', AlbumStore.ONEIRIC_DIARY);
MusicStore.set('회전목마', AlbumStore.ONEIRIC_DIARY);
MusicStore.set('Rococo', AlbumStore.ONEIRIC_DIARY);
MusicStore.set('With*One', AlbumStore.ONEIRIC_DIARY);

MusicStore.set('Mise-en-Scène', AlbumStore.ONE_REELER);
MusicStore.set('Panorama', AlbumStore.ONE_REELER);
MusicStore.set('Island', AlbumStore.ONE_REELER);
MusicStore.set('Sequence', AlbumStore.ONE_REELER);
MusicStore.set('O Sole Mio', AlbumStore.ONE_REELER);
MusicStore.set('느린 여행', AlbumStore.ONE_REELER);
MusicStore.set('D-D-DANCE', AlbumStore.ONE_REELER);

MusicStore.set('Lesson', AlbumStore.ONE_THE_STORY);
MusicStore.set('평행우주', AlbumStore.ONE_THE_STORY);

export { AlbumStore, MusicStore };
