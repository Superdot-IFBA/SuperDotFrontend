import * as Icon from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "../Button/Button";
import { updateUser } from "../../api/researchers.api";
import { Notify, NotificationType } from "../../components/Notify/Notify";
import { PasswordValidationCard } from "../PasswordValidate/PasswordValidate";
interface UserOptionsProps {
  currentUser: {
    fullName: string;
    email: string;
    profilePhoto?: string;
  };
  onSave?: (updatedData: {
    fullName?: string;
    profilePhoto?: string;
    newPassword?: string;
  }) => void;
}


interface ErrorState {
  message: string;
  type: 'error' | 'success' | '';
  field?: string;
}

export const ProfileEdit = ({
  currentUser = { fullName: '', email: '', profilePhoto: '' },
  onSave,
}: UserOptionsProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [name, setName] = useState(currentUser.fullName || '');
  const [avatarPreview, setAvatarPreview] = useState(currentUser.profilePhoto || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorState>({ message: '', type: '' });
  const [notificationData, setNotificationData] = useState<{
    title: string;
    description: string;
    type?: NotificationType;
  }>({
    title: "",
    description: "",
    type: undefined,
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);

      setAvatarFile(file);
    }
  };

  const clearError = () => {
    setError({ message: '', type: '' });
  };

  const showError = (message: string, field?: string) => {
    setError({ message, type: 'error', field });
    setTimeout(() => clearError(), 5000);
  };

  const showSuccess = () => {
    setNotificationData({
      title: "Perfil atualizado com sucesso!",
      description: "testrwe",
      type: "success",
    });
  };

  const validateForm = (): boolean => {
    clearError();

    if (activeTab === 'security') {
      if (newPassword && !currentPassword) {
        showError('Senha atual é obrigatória para alterar a senha', 'current-password');
        return false;
      }

      if (newPassword && newPassword.length < 8) {
        showError('A nova senha deve ter pelo menos 8 caracteres', 'new-password');
        return false;
      }

      if (newPassword && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(newPassword)) {
        showError('A senha deve conter letras maiúsculas, minúsculas, números e símbolos', 'new-password');
        return false;
      }

      if (newPassword && confirmPassword !== newPassword) {
        showError('As senhas não coincidem', 'confirm-password');
        return false;
      }
    }

    if (activeTab === 'profile' && !name.trim()) {
      showError('O nome é obrigatório', 'name');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const noChanges =
      name === currentUser.fullName &&
      !avatarFile &&
      !newPassword;

    if (noChanges) {
      setNotificationData({
        title: 'Nenhuma alteração detectada',
        description: 'Você não modificou nenhuma informação do perfil.',
        type: 'info',
      });
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      const formData = new FormData();

      formData.append("fullName", name);

      if (avatarFile) {
        formData.append("profilePhoto", avatarFile);
        setNotificationData({
          title: 'Foto de perfil atualizada!',
          description: 'Sua nova foto de perfil foi salva com sucesso.',
          type: 'success',
        });
      }

      if (currentUser.profilePhoto) {
        formData.append("existingProfilePhoto", currentUser.profilePhoto);
        setNotificationData({
          title: 'Nome atualizado!',
          description: 'Seu nome foi alterado com sucesso.',
          type: 'success',
        });
      }

      if (newPassword) {
        formData.append("currentPassword", currentPassword);
        formData.append("password", newPassword);
        formData.append("passwordConfirmation", confirmPassword);
        setNotificationData({
          title: 'Senha alterada!',
          description: 'Sua senha foi atualizada com sucesso.',
          type: 'success',
        });
      }

      const updatedUser = await updateUser(formData);

      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');

      if (name !== currentUser.fullName) {

      }

      if (avatarFile) {

      }

      if (newPassword) {

      }

      onSave?.({
        fullName: updatedUser.personalData.fullName,
        profilePhoto: updatedUser.personalData.profilePhoto,
      });

    } catch (err: any) {
      const errorResponse = err.response;
      if (errorResponse) {
        const { status, data } = errorResponse;
        const errorMessage = data?.message || 'Erro ao atualizar perfil';
        const errorCode = data?.code;

        if (status === 400) {
          switch (errorCode) {
            case 'PASSWORD_INCORRECT':
              showError('Senha atual incorreta', 'current-password');
              break;
            case 'PASSWORD_REQUIRED':
              showError('Senha atual é obrigatória para alterar a senha', 'current-password');
              break;
            case 'PASSWORDS_MISMATCH':
              showError('As senhas não coincidem', 'confirm-password');
              break;
            case 'NO_DATA':
              showError('Nenhum dado foi modificado');
              break;
            default:
              showError(errorMessage);
          }
        } else {
          showError(errorMessage);
        }
      } else {
        showError('Erro de conexão. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasFieldError = (fieldName: string): boolean => {
    return error.field === fieldName;
  };

  return (
    <>
      <Notify
        open={!!notificationData.title}
        onOpenChange={() => setNotificationData({ title: "", description: "", type: undefined })}
        title={notificationData.title}
        description={notificationData.description}
        type={notificationData.type}
      />
      <div className="bg-gradient-to-br from-violet-600 via-purple-500 to-primary py-8 w-full flex justify-center items-center">
        <h2 className="heading-2 !text-white">Configurações da Conta</h2>
      </div>
      <div className="bg-white card-container overflow-hidden max-w-3xl mx-auto">

        {error.message && (
          <div className={`px-6 py-3 rounded-lg mx-4 mt-4 ${error.type === 'error'
            ? 'bg-red-100 text-red-700 border border-red-200'
            : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {error.type === 'error' ? (
                  <Icon.WarningCircle size={20} className="mr-2" weight="fill" />
                ) : (
                  <Icon.CheckCircle size={20} className="mr-2" weight="fill" />
                )}
                <span>{error.message}</span>
              </div>
              <button
                onClick={clearError}
                className="ml-4 hover:opacity-70 transition-opacity">
                <Icon.X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row">

          <div className="w-full md:w-56 bg-gray-50 p-4 border-r border-gray-200">
            <div className="flex flex-col gap-1">
              <Button
                onClick={() => {
                  clearError();
                  setActiveTab('profile');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="!justify-start"
                title={"Perfil"} color={`${activeTab === 'profile'
                  ? 'primary'
                  : 'white'}`}>
                <Icon.User className="mr-3" size={20} weight={activeTab === 'profile' ? 'fill' : 'regular'} />

              </Button>
              <Button
                onClick={() => {
                  clearError();
                  setActiveTab('security');
                }}
                className="!justify-start"
                title={"Segurança"} color={`${activeTab === 'security'
                  ? 'primary'
                  : 'white'}`}
              >
                <Icon.LockKey className="mr-3" size={20} weight={activeTab === 'security' ? 'fill' : 'regular'} />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'profile' ? (
                <>
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                      <img
                        src={avatarPreview}
                        alt="User avatar"
                        className="w-24 h-24 rounded-full object-cover border-4 border-primary "
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer  transition-colors shadow-lg"
                        title="Alterar foto"
                      >
                        <Icon.Camera size={16} />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>

                    <div className="w-full max-w-md space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nome
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => {
                            clearError();
                            setName(e.target.value);
                          }}
                          className={`w-full px-4 py-2 border rounded-lg transition-all ${hasFieldError('name')
                            ? 'border-red-500 ring-2 ring-red-200'
                            : 'border-gray-300'
                            }`}
                          placeholder="Seu nome"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={currentUser.email}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      Senha atual <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => {
                          clearError();
                          setCurrentPassword(e.target.value);
                        }}
                        className={`w-full px-4 py-2 border rounded-lg transition-all pr-10 ${hasFieldError('current-password')
                          ? 'border-red-500 ring-2 ring-red-200'
                          : 'border-gray-300'
                          }`}
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                      >
                        {showCurrentPassword ? <Icon.Eye size={18} /> : <Icon.EyeSlash size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="new-password" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      Nova senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => {
                          clearError();
                          setNewPassword(e.target.value);
                        }}
                        className={`w-full px-4 py-2 border rounded-lg transition-all pr-10 ${hasFieldError('new-password')
                          ? 'border-red-500 ring-2 ring-red-200'
                          : 'border-gray-300'
                          }`}
                        placeholder="Digite a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                      >
                        {showNewPassword ? <Icon.Eye size={18} /> : <Icon.EyeSlash size={18} />}
                      </button>
                    </div>
                    <div
                      className={`transition-all duration-500 ease-out overflow-hidden ${newPassword ? "opacity-100 max-h-96 translate-y-0" : "opacity-0 max-h-0 -translate-y-2"
                        }`}
                    >
                      <PasswordValidationCard password={newPassword} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-800 mb-2 text-left">
                      Confirmar nova senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => {
                          clearError();
                          setConfirmPassword(e.target.value);
                        }}
                        className={`w-full px-4 py-2 border rounded-lg transition-all pr-10 ${hasFieldError('confirm-password')
                          ? 'border-red-500 ring-2 ring-red-200'
                          : 'border-gray-300'
                          }`}
                        placeholder="Confirme a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                      >
                        {showConfirmPassword ? <Icon.Eye size={18} /> : <Icon.EyeSlash size={18} />}
                      </button>
                    </div>

                    {newPassword && confirmPassword && (
                      <div className={`mt-2 flex items-center gap-2 text-sm ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                        {newPassword === confirmPassword ? (
                          <>
                            <Icon.CheckCircle size={16} weight="fill" />
                            <span>Senhas coincidem</span>
                          </>
                        ) : (
                          <>
                            <Icon.WarningCircle size={16} weight="fill" />
                            <span>Senhas não coincidem</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-center pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  title={"Salvar alterações"}
                  color="green"
                  disabled={isLoading}
                  children={
                    isLoading ? (
                      <Icon.SpinnerGap size={18} className="animate-spin" />
                    ) : (
                      <Icon.FloppyDisk size={18} weight="bold" />
                    )
                  }
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};