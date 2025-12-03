import { Heading, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import BackgroundComponent from "../Background/Background";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex flex-col items-center justify-center  bg-gradient-to-b from-off-white to-white w-full">
      <BackgroundComponent />
      <div className="max-w-md w-full text-center space-y-6 absolute p-4">
        <Heading size="9" className="text-white">
          404
        </Heading>

        <Heading size="5" className="text-white">
          Página não encontrada
        </Heading>

        <Text className="text-white">
          O conteúdo que você está tentando acessar não existe ou foi movido.
        </Text>
        <br></br>
        <Button
          size="Full"
          className="mt-6 mx-auto"
          onClick={() => navigate("/")} title={"Retornar para página inicial"} />
      </div>

    </div>
  );
};

export default NotFoundPage;