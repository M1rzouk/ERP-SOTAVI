// Mock users database
const mockUsers = [
  {
    id: 1,
    matricule: "2037",
    password: "00",
    name: "Ahmed Benali",
    role: "chef centre",
    avatar: "/assets/pdps/hwas.png",
  },
  {
    id: 2,
    matricule: "33070",
    password: "00",
    name: "Karim Meksi",
    role: "Bureau d'ordre",
    avatar: "/assets/pdps/hwas.png",
  },
  {
    id: 3,
    matricule: "admin",
    password: "admin",
    name: "Administrateur",
    role: "All",
    avatar: "/assets/pdps/hwas.png",
  },
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (matricule, password) => {
    await delay(500);
    const user = mockUsers.find(
      u => u.matricule === matricule && u.password === password
    );
    if (!user) throw new Error("Matricule ou mot de passe incorrect");
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },
  logout: () => {
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("user");
  },
};