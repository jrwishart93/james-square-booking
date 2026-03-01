export const EMAIL_GROUPS = {
  committee: [
    'derekp19@gmail.com',
    'prworks22@aol.com',
    'agnesdcw@icloud.com',
    'derek.turnbull568@btinternet.com',
    'm.trusson@outlook.com',
    'Jrwishart@hotmail.co.uk',
  ],
  myreside: [
    'leigh@myreside-management.co.uk',
    'cory@myreside-management.co.uk',
  ],
} as const;

export type EmailGroupKey = keyof typeof EMAIL_GROUPS;
