export type PostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export class DataOfUsersLikes {
  constructor(public addedAt: string, public userId: string, public userLogin: string, public likeStatus: string) {}
}

export class PostDBModel {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      users: DataOfUsersLikes[];
    },
  ) {}
}
