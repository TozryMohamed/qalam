// import { useAuth } from './useAuth';

// export function useRole() {
//   const { profile, loading, user } = useAuth();
//   const role = profile?.role || 'user';

//   // 🔍 DEBUG TEMPORAIRE
//   console.log('🎭 useRole:', {
//     userEmail: user?.email,
//     profileLoaded: !!profile,
//     profileRole: profile?.role,
//     computedRole: role,
//     isAuthor: role === 'author' || role === 'admin',
//     loading,
//   });

//   return {
//     role,
//     isUser: role === 'user',
//     isAuthor: role === 'author' || role === 'admin',
//     isAdmin: role === 'admin',
//     loading,
//   };
// }




import { useAuth } from './useAuth';

export function useRole() {
  const auth = useAuth();

  console.log('🎭 useRole appelé — reçoit:', {
    auth,
    user: auth?.user?.email,
    profile: auth?.profile?.role,
    loading: auth?.loading,
  });

  const role = auth?.profile?.role || 'user';

  return {
    role,
    isUser: role === 'user',
    isAuthor: role === 'author' || role === 'admin',
    isAdmin: role === 'admin',
    loading: auth?.loading ?? false,
  };
}