type PlaytimeData = [string, number][];
type EmotionData = [number, number, number, number];

const EmotionStore = new Map<string, EmotionData>();

EmotionStore.set('라비앙로즈', [2, 2, 1, 1]);
EmotionStore.set('비올레타', [2, 2, 1, 1]);
EmotionStore.set('환상동화', [3, 3, 1, 0]);
EmotionStore.set('FIESTA', [2, 2, 1, 1]);
EmotionStore.set('Panorama', [2, 3, 2, 1]);
EmotionStore.set('하늘 위로', [3, 2, 1, 0]);
EmotionStore.set('Suki to Iwasetai', [2, 2, 0, 1]);
EmotionStore.set("O' My!", [3, 2, 0, 0]);
EmotionStore.set('Airplane', [3, 2, 1, 0]);
EmotionStore.set('Really Like You', [0, 1, 3, 2]);
EmotionStore.set('해바라기', [2, 2, 2, 1]);
EmotionStore.set('SPACESHIP', [3, 2, 0, 0]);
EmotionStore.set('With*One', [0, 0, 3, 3]);
EmotionStore.set('Highlight', [2, 3, 0, 0]);
EmotionStore.set('회전목마', [2, 2, 1, 1]);
EmotionStore.set('반해버리잖아?', [2, 2, 0, 0]);
EmotionStore.set('내꺼야', [3, 1, 0, 0]);
EmotionStore.set('Buenos Aires', [2, 2, 0, 0]);
EmotionStore.set('Sequence', [2, 3, 0, 0]);
EmotionStore.set('Beware', [3, 2, 0, 0]);
EmotionStore.set('꿈을 꾸는 동안', [0, 0, 3, 2]);
EmotionStore.set('Pretty', [3, 2, 0, 0]);
EmotionStore.set('비밀의 시간', [0, 1, 3, 2]);
EmotionStore.set('아름다운 색', [1, 0, 3, 2]);
EmotionStore.set('Rumor', [2, 3, 0, 0]);
EmotionStore.set('Intro', [0, 0, 2, 0]);
EmotionStore.set('Vampire', [2, 2, 0, 0]);
EmotionStore.set('Welcome', [0, 2, 2, 1]);
EmotionStore.set('Rococo', [3, 2, 1, 0]);
EmotionStore.set('앞으로 잘 부탁해', [2, 2, 1, 0]);
EmotionStore.set('Dance break', [3, 3, 0, 0]);
EmotionStore.set('고양이가 되고 싶어', [2, 2, 1, 1]);
EmotionStore.set('기분 좋은 안녕', [1, 2, 2, 1]);
EmotionStore.set('SO CURIOUS', [3, 2, 0, 0]);
EmotionStore.set('AYAYAYA', [2, 3, 0, 0]);
EmotionStore.set('우연이 아니야', [0, 1, 3, 2]);
EmotionStore.set('느린 여행', [0, 0, 3, 3]);
EmotionStore.set('年下Boyfriend', [3, 2, 0, 0]);
EmotionStore.set('YOU & I', [0, 0, 3, 2]);
EmotionStore.set('언젠가 우리의 밤도 지나가겠죠', [0, 0, 3, 3]);
EmotionStore.set('D-D-DANCE', [2, 2, 0, 0]);
EmotionStore.set('Mise-en-Scène', [2, 3, 1, 1]);
EmotionStore.set('춤이 생각날 때까지', [1, 1, 0, 0]);
EmotionStore.set('OPEN YOUR EYES', [2, 0, 1, 1]);
EmotionStore.set('Lesson', [0, 0, 3, 3]);
EmotionStore.set('DAYDREAM', [2, 3, 0, 0]);
EmotionStore.set('PINK BLUSHER', [3, 2, 0, 0]);
EmotionStore.set('DREAMLIKE', [2, 0, 1, 1]);
EmotionStore.set('Island', [3, 0, 1, 1]);
EmotionStore.set('O Sole Mio', [2, 0, 1, 1]);
EmotionStore.set('평행우주', [0, 0, 3, 3]);

export { PlaytimeData, EmotionData };
export default EmotionStore;