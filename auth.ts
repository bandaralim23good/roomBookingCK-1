// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";

// import { prisma } from "./src/lib/prisma";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     Credentials({
//       credentials: {
//         department: {
//           label: "Department",
//           type: "text",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },

//       async authorize(credentials) {
//         if (!credentials?.department || !credentials?.password) {
//           return null;
//         }

//         const user = await prisma.user.findUnique({
//           where: {
//             department: credentials.department as string,
//           },
//         });

//         if (!user) {
//           return null;
//         }

//         const passwordMatch = await bcrypt.compare(
//           credentials.password as string,
//           user.password
//         );

//         if (!passwordMatch) {
//           return null;
//         }

//         return {
//           id: user.id,
//           department: user.department,
//           role: user.role,
//         };
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.department = user.department;
//         token.role = user.role;
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.department = token.department as string;
//         session.user.role = token.role as "ADMIN" | "USER";
//       }

//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// });
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "./src/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                console.log("========== AUTHORIZE DIPANGGIL ==========");
                console.log("USERNAME:", credentials?.username);

                if (!credentials?.username || !credentials?.password) {
                    console.log("❌ CREDENTIALS KOSONG");
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            username: credentials.username as string,
                        },
                    });

                    console.log(
                        "USER:",
                        user
                            ? {
                                id: user.id,
                                username: user.username,
                                department: user.department,
                                role: user.role,
                                hasPassword: !!user.password,
                            }
                            : "TIDAK DITEMUKAN"
                    );

                    if (!user) {
                        console.log("❌ USER TIDAK DITEMUKAN");
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    console.log("PASSWORD MATCH:", passwordMatch);

                    if (!passwordMatch) {
                        console.log("❌ PASSWORD TIDAK COCOK");
                        return null;
                    }

                    console.log("✅ AUTHORIZATION BERHASIL");

                    return {
                        id: user.id,
                        username: user.username,
                        department: user.department,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("🔥 ERROR DI AUTHORIZE:", error);
                    return null;
                }
            }

        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.department = user.department;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.department = token.department as string;
                session.user.role = token.role as "ADMIN" | "USER";
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
});