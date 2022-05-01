type Lyrics = { [key: number]: string } | { [key: number]: string[] };

interface Radio {
  id: string;
  title: string;
  album: string;
  duration: number;
  lyrics: Lyrics | null;
}

export { Lyrics };
export default Radio;
