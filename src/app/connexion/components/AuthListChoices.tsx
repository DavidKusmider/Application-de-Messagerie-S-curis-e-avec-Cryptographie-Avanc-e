import Modal from "@/app/components/modals/Modal";
import AuthSocialButton from "./AuthSocialButton";
import { BsFacebook, BsTwitter } from "react-icons/bs";

interface AuthListChoicesProps {
    isOpen? : boolean
    onClose: () => void;
    onClick: (action:string) => void;
}

const AuthListChoices: React.FC<AuthListChoicesProps> = ({ 
    isOpen,
    onClose,
    onClick,
  }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
             <div>
                <AuthSocialButton 
                icon={BsFacebook} 
                onClick={() => onClick('facebook')} 
                />
             </div>
             <div>
                <AuthSocialButton 
                icon={BsTwitter} 
                onClick={() => onClick('twitter')} 
                />
             </div>
        </Modal>
      )
    }

export default AuthListChoices;