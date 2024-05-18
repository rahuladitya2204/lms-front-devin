import { Store } from "@adewaskar/lms-common";
import { useModal } from "./ActionModal/ModalContext";
import LearnerLogin from "@Screens/post-authentication/Learner/Screens/Login";

interface AuthProtectedCTAPropsI {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function AuthProtectedCTA(props: AuthProtectedCTAPropsI) {
  const { isSignedIn } = Store.useAuthentication((s) => s);
  const { openModal } = useModal();

  const handleClick = () => {
    if (isSignedIn) {
      props.onClick && props.onClick();
    } else {
      openModal(
        <LearnerLogin
          onSuccess={() => {
            props.onClick && props.onClick();
          }}
        />,
        { width: 300 }
      );
    }
  };

  return <span onClick={handleClick}>{props.children}</span>;
}
