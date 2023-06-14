export class usersLikes {
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
      users: usersLikes[];
    },
  ) {}
}

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: userLikes[];
  };
};

export type userLikes = {
  addedAt: string;
  userId: string;
  login: string;
};
