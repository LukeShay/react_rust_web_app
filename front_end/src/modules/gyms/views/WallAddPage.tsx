import {
  createStyles,
  FormGroup,
  FormHelperText,
  FormLabel,
  makeStyles,
  Theme
} from "@material-ui/core";
import React, { useEffect } from "react";
import * as ReactRouter from "react-router";
import { toast } from "react-toastify";
import * as GymsActions from "../../../context/gyms/gymsActions";
import { useGymsContext } from "../../../context/gyms/gymsStore";
import { useUserContext } from "../../../context/user/userStore";
import { Routes } from "../../../routes";
import { Wall } from "../../../types";
import * as UrlUtils from "../../../utils/urlUtils";
import Button from "../../common/buttons/ButtonSecondary";
import Form from "../../common/forms/Form";
import CheckBox from "../../common/inputs/CheckBox";
import Input from "../../common/inputs/Input";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    checkboxGroup: {
      marginLeft: "145px"
    },
    helpText: {
      color: theme.palette.error.main,
      padding: "5px"
    }
  })
);

const WallAddPage: React.FunctionComponent = () => {
  const classes = useStyles();

  const history = ReactRouter.useHistory();

  const [name, setName] = React.useState<string>("");
  const [gymId, setGymId] = React.useState<string>("");
  const [lead, setLead] = React.useState<boolean>(false);
  const [topRope, setTopRope] = React.useState<boolean>(false);
  const [autoBelay, setAutoBelay] = React.useState<boolean>(false);
  const [boulder, setBoulder] = React.useState<boolean>(false);
  const [typesMessage, setTypesMessage] = React.useState<string>("");
  const [nameMessage, setNameMessage] = React.useState<string>("");

  const { state: gymsState, dispatch: gymsDispatch } = useGymsContext();
  const { state: userState } = useUserContext();

  useEffect(() => {
    const currentGymId = UrlUtils.getLastPathVariable(
      history.location.pathname
    );

    setGymId(currentGymId);

    const tempGym = gymsState.gyms
      .filter((element) => element.id === currentGymId)
      .pop();

    const { user } = userState;

    if (
      !tempGym ||
      !user ||
      (tempGym &&
        (!tempGym.authorizedEditors ||
          !tempGym.authorizedEditors.find(
            (editorId: string) => editorId === user.userId
          )))
    ) {
      history.push(Routes.GYMS + "/" + gymId);
    }
  }, []);

  const handleChange = (event: any) => {
    const { id, value } = event.target;

    if (id === "name") {
      setName(value);
    } else if (id === "topRope") {
      setTopRope(!topRope);
    } else if (id === "lead") {
      setLead(!lead);
    } else if (id === "autoBelay") {
      setAutoBelay(!autoBelay);
    } else if (id === "boulder") {
      setBoulder(!boulder);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const types: string[] = [];

    if (lead) {
      types.push("LEAD");
    }

    if (topRope) {
      types.push("TOP_ROPE");
    }

    if (autoBelay) {
      types.push("AUTO_BELAY");
    }

    if (boulder) {
      types.push("BOULDER");
    }

    if (types.length === 0) {
      setTypesMessage("Select a type.");
    }

    if (name.trim().length === 0) {
      setNameMessage("Name cannot be blank.");
    }

    if (types.length !== 0 && name.trim().length !== 0) {
      setTypesMessage("");
      setNameMessage("");
      GymsActions.createWall(
        gymsDispatch,
        { name, types, gymId } as Wall,
        gymId
      ).then((response) => {
        if (response instanceof Response && response.ok) {
          history.push(Routes.GYMS + "/" + gymId);
        } else {
          toast.error("Error adding wall.");
        }
      });
    }
  };

  const handleCancel = () => {
    history.push(Routes.GYMS + "/" + gymId);
  };

  const FormHead: JSX.Element = (
    <div style={{ display: "inline" }}>
      <div style={{ float: "left", marginRight: "25px", marginTop: "5px" }}>
        Add Wall
      </div>
      <div style={{ float: "right", marginLeft: "25px" }}>
        <Button onClick={handleCancel} type="button" variant="outlined">
          Cancel
        </Button>
      </div>
    </div>
  );

  const FormInputs: JSX.Element = (
    <React.Fragment>
      <Input
        placeholder="Name"
        id="name"
        value={name}
        handleChange={handleChange}
        type="text"
        autoComplete="name"
        autoCapitalize="true"
        helpText={nameMessage}
      />
      <FormLabel component="legend">Pick one</FormLabel>
      <FormGroup>
        <CheckBox
          id="topRope"
          checked={topRope}
          value="TOP_ROPE"
          label="Top rope"
          onChange={handleChange}
          className={classes.checkboxGroup}
          color="primary"
        />
        <CheckBox
          id="lead"
          checked={lead}
          value="LEAD"
          label="Lead"
          onChange={handleChange}
          className={classes.checkboxGroup}
          color="primary"
        />
        <CheckBox
          id="autoBelay"
          checked={autoBelay}
          value="AUTO_BELAY"
          label="Auto belay"
          onChange={handleChange}
          className={classes.checkboxGroup}
          color="primary"
        />
        <CheckBox
          id="boulder"
          checked={boulder}
          value="BOULDER"
          label="Boulder"
          onChange={handleChange}
          className={classes.checkboxGroup}
          color="primary"
        />
        <FormHelperText className={classes.helpText}>
          {typesMessage}
        </FormHelperText>
      </FormGroup>
    </React.Fragment>
  );

  return (
    <Form
      title={FormHead}
      formInputs={FormInputs}
      buttonText="Add wall"
      handleSubmit={handleSubmit}
    />
  );
};

export default WallAddPage;