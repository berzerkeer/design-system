import { EditableText, EditableTextProps } from "../EditableText";
import { SavingState } from "../EditableTextSubComponent";
import { Toaster } from "../Toast";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Classes } from "@blueprintjs/core";
import { Variant } from "Constants/variants";
import { typography } from "Constants/typography";
import {
  createMessage,
  ERROR_EMPTY_APPLICATION_NAME,
} from "Constants/messages";

type EditableTextWrapperProps = EditableTextProps & {
  variant: "UNDERLINE" | "ICON";
  isNewApp: boolean;
};

const Container = styled.div<{
  isEditing?: boolean;
  savingState: SavingState;
  isInvalid: boolean;
}>`
  position: relative;
  .editable-text-container {
    justify-content: center;
  }

  &&& .${Classes.EDITABLE_TEXT}, .icon-wrapper {
    padding: 5px 0px;
    height: 31px;
    background-color: ${(props) =>
      (props.isInvalid && props.isEditing) ||
      props.savingState === SavingState.ERROR
        ? "var(--ads-editable-text-sub-component-danger-text-color)"
        : "transparent"};
  }

  &&&& .${Classes.EDITABLE_TEXT}:hover {
    ${(props) =>
      !props.isEditing
        ? `
      border-bottom-style: solid;
      border-bottom-width: 1px;
      width: fit-content;
      max-width: 194px;
    `
        : null}
  }

  &&&& .${Classes.EDITABLE_TEXT_CONTENT} {
    ${(props) =>
      !props.isEditing
        ? `
        min-width: 0px !important;
        height: auto !important;
        line-height: ${typography.h4.lineHeight}px !important;
    `
        : null}
  }

  &&& .${Classes.EDITABLE_TEXT_CONTENT}, &&& .${Classes.EDITABLE_TEXT_INPUT} {
    text-align: center;
    color: var(--ads-editable-text-wrapper-default-text-color);
    font-size: ${typography.h4.fontSize}px;
    line-height: ${typography.h4.lineHeight}px;
    letter-spacing: ${typography.h4.letterSpacing}px;
    font-weight: ${typography.h4.fontWeight};
    padding-right: 0px;
  }

  .icon-wrapper {
    padding-bottom: 0px;
    position: absolute;
    right: 0;
    top: 0;
  }
`;

export default function EditableTextWrapper(props: EditableTextWrapperProps) {
  const [isEditing, setIsEditing] = useState(props.isNewApp);
  const [isValid, setIsValid] = useState(false);
  const onBlur = props.onBlur;

  useEffect(() => {
    setIsEditing(props.isNewApp);
  }, [props.isNewApp]);

  return (
    <Container
      isEditing={isEditing}
      isInvalid={isValid}
      savingState={props.savingState}
    >
      <EditableText
        className={props.className}
        defaultValue={props.defaultValue}
        editInteractionKind={props.editInteractionKind}
        fill={!!props.fill}
        hideEditIcon={props.hideEditIcon}
        isEditingDefault={props.isNewApp}
        isInvalid={(value: string) => {
          setIsEditing(true);
          if (props.isInvalid) {
            setIsValid(Boolean(props.isInvalid(value)));
            return props.isInvalid(value);
          } else if (value.trim() === "") {
            Toaster.show({
              text: createMessage(ERROR_EMPTY_APPLICATION_NAME),
              variant: Variant.danger,
            });
            return false;
          } else {
            return false;
          }
        }}
        onBlur={(value) => {
          setIsEditing(false);
          onBlur && onBlur(value);
        }}
        onTextChanged={() => setIsEditing(true)}
        placeholder={props.placeholder}
        savingState={props.savingState}
      />
    </Container>
  );
}
