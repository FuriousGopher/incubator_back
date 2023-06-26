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
      myStatus?: string;
    },
  ) {}
}

export type UserLikes = {
  userId: string;
  likeStatus: string;
};
