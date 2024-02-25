export interface ColorsPallete {
  primary: string;
  card: string;
  background: string;
  text: string;
  border: string;
  notification: string;
}

export interface ITheme {
  dark: boolean;
  colors: ColorsPallete;
}

export enum Colors {
  White = '#FFFFFF',
  Black = '#000000',
}
