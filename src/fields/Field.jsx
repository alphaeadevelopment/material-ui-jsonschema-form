import React from 'react';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input from 'material-ui/Input';
import fieldStyles from './field-styles';
import configureComponent from './configure';

// for unit testing only
export const ConfiguredField = ({
  classes = {}, data, type, descriptionText, helpText, Component = Input, LabelComponent, labelComponentProps = {},
  title, className, componentProps = {}, id,
}) =>
  (
    <FormControl className={classNames(classes.root, { [classes.withLabel]: LabelComponent })}>
      {LabelComponent && title &&
        <LabelComponent
          {...labelComponentProps}
        >{title}
        </LabelComponent>
      }
      {descriptionText && <p className={classes.description}>{descriptionText}</p>}
      <Component
        className={className && classes[className]}
        value={data}
        type={type}
        {...componentProps}
      />
      {helpText && <FormHelperText id={`${id}-help`}>{helpText}</FormHelperText>}
    </FormControl>
  );
const StyledConfiguredField = withStyles(fieldStyles)(ConfiguredField);

export default (props) => {
  const { path, id, schema, data, uiSchema } = props;
  const { type } = schema;
  const htmlId = `${id}_${path}`;
  const {
    Component, LabelComponent, componentProps, labelComponentProps, className, title,
  } = configureComponent({ ...props, htmlId });

  const descriptionText = uiSchema['ui:description'];
  const helpText = uiSchema['ui:help'];
  return (
    <StyledConfiguredField
      id={id}
      className={className}
      data={data}
      type={type}
      Component={Component}
      componentProps={componentProps}
      LabelComponent={LabelComponent}
      labelComponentProps={labelComponentProps}
      title={title}
      descriptionText={descriptionText}
      helpText={helpText}
    />
  );
};
