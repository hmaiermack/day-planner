//if you wanted jwt to store more than just an id you can add it to this type and alter getTokens helper function in authService and all calls of getTokens
//possible refactoring opportunity so you just have to change getTokens definition and not subsequent calls?
export type JwtPayload = {
  sub: number;
  //username: string;
  //etc
};
