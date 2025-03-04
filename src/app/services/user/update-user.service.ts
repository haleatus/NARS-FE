import { endpoints } from "@/core/contants/endpoints";
import { UpdateUser } from "@/core/interface/user/user.interface";

export const updateUserService = async (
  accessToken: string,
  data: UpdateUser
) => {
  const response = await fetch(endpoints.user.updateUser, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const userData = await response.json();

  if (!response.ok) {
    throw new Error(userData.message);
  }

  return userData;
};
