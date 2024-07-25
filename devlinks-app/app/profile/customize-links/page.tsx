import CustomizeLinksForm from "@/components/CustomizeLinksForm";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { clientConfig, serverConfig } from "../../../config";
import { redirect } from "next/navigation";

const page = async () => {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });
  if (!tokens) {
    redirect("/auth/login");
    return null;
  }
  return (
    <div>
      <CustomizeLinksForm />
    </div>
  );
};

export default page;
