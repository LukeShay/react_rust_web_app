import React, {
  createContext,
  Dispatch,
  Reducer,
  useReducer,
  useContext
} from "react";
import { User } from "../../types";
import Types from "./userActionTypes";

export interface IUserContextState {
  user: User | null;
}

export interface IUserContextAction {
  actionType: string;
  user: User | null;
}

export interface IContextProps {
  state: IUserContextState;
  dispatch: Dispatch<IUserContextAction>;
}

export const StoreContext = createContext<IContextProps>({} as IContextProps);

const reducer: Reducer<IUserContextState, IUserContextAction> = (
  state: IUserContextState,
  action: IUserContextAction
): IUserContextState => {
  switch (action.actionType) {
    case Types.SIGN_IN:
      return { user: action.user };

    case Types.SIGN_OUT:
      return { user: null };

    case Types.UPDATE_USER:
      return { user: action.user };

    default:
      throw new Error("Action type must be defined");
  }
};

const initialState: IUserContextState = {
  user: null
};

export const UserStore: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useUserContext = () => useContext(StoreContext);