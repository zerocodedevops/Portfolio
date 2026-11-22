import toast from "react-hot-toast";
import { resetDemoStore } from "../demo/demoStore";

export const seedDatabase = async () => {
  try {
    resetDemoStore();
    toast.success("Datos de demostración restaurados al estado inicial.");
  } catch (error) {
    console.error("Error resetting demo store:", error);
    toast.error("Error al restaurar los datos de demostración.");
  }
};
