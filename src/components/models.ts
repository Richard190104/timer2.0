export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Game {
  id: number;
  title: string;
  script: string;
}

export interface ShopItem {
  id: string;
  title: string;
  price: number;
  choosenAmount: number;
}

export interface Task {
  message: string;
  CommentedText: string;
  completed: boolean;
  testCredits: number;
}

export interface click{
  score: number;
  timeLeft: number;
}