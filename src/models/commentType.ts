export class CommentDBModel {
  constructor(
    public id: string,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string,
    public postId: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
      users: UserLikes[];
    },
  ) {}
}

export type UserLikes = {
  userId: string;
  likeStatus: string;
};

export type CommentDBModelType = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  postId: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    users: UserLikes[];
  };
};
