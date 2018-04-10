import React from 'react';
import classNames from 'classnames';
import keys from 'lodash/keys';
import endsWith from 'lodash/endsWith';
import includes from 'lodash/includes';
import slice from 'lodash/slice';
import IconButton from 'material-ui/IconButton';
import ArrowUpward from 'material-ui-icons/ArrowUpward';
import ArrowDownward from 'material-ui-icons/ArrowDownward';
import RemoveCircle from 'material-ui-icons/RemoveCircle';
import AddCircle from 'material-ui-icons/AddCircle';
import isArray from 'lodash/isArray';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import FormField from './FormField';
import fieldSetStyles from './field-set-styles';
import getDefaultValue from './helpers/get-default-value';

export const RawReorderControls = ({ first, last, classes, onMoveItemUp, onMoveItemDown, onDeleteItem }) => (
  <div className={classes.root}>
    <IconButton className={classes.up} onClick={onMoveItemUp} disabled={first}><ArrowUpward /></IconButton>
    <IconButton className={classes.down} onClick={onMoveItemDown} disabled={last}><ArrowDownward /></IconButton>
    <IconButton className={classes.remove} onClick={onDeleteItem} ><RemoveCircle /></IconButton>
  </div>
);
export const ReorderControls = withStyles(fieldSetStyles.reorderControls)(RawReorderControls);

export const RawReorderableFormField = ({
  first, last, className, classes, path, onMoveItemUp, onMoveItemDown, onDeleteItem, ...rest
}) =>
  (
    <div className={classNames(className, classes.root)}>
      <FormField
        path={path}
        {...rest}
      />
      <ReorderControls
        first={first}
        last={last}
        onMoveItemUp={onMoveItemUp}
        onMoveItemDown={onMoveItemDown}
        onDeleteItem={onDeleteItem}
      />
    </div>
  );
export const ReorderableFormField = withStyles(fieldSetStyles.reorderable)(RawReorderableFormField);
export const RawFieldSetArray = (props) => {
  const {
    startIdx = 0, className, classes,
    schema = {}, uiSchema = {}, data, path, onMoveItemUp, onMoveItemDown, onDeleteItem, ...rest
  } = props;
  return (
    <div className={classes.root}>
      {!isArray(schema.items) && !schema.uniqueItems && (
        <div>
          {(data || []).map((d, idx) => (
            <ReorderableFormField
              key={`${path}[${idx}]` // eslint-disable-line react/no-array-index-key
              }
              path={`${path}[${startIdx + idx}]`}
              required={schema.required}
              schema={schema.items}
              data={d}
              onMoveItemUp={onMoveItemUp && onMoveItemUp(path, startIdx + idx)}
              onMoveItemDown={onMoveItemDown && onMoveItemDown(path, startIdx + idx)}
              onDeleteItem={onDeleteItem && onDeleteItem(path, startIdx + idx)}
              uiSchema={uiSchema.items}
              first={idx === 0}
              last={idx === data.length - 1}
              {...rest}
            />
          ))}
          <div className={classes.addItemBtn}>
            <IconButton onClick={rest.onAddItem && rest.onAddItem(path, getDefaultValue(schema.items))}>
              <AddCircle />
            </IconButton>
          </div>
        </div>
      )}
      {isArray(schema.items) && (data || []).map((d, idx) => {
        if (idx < schema.items.length) {
          return (<FormField
            key={`${path}[${idx}]` // eslint-disable-line react/no-array-index-key
            }
            path={`${path}[${startIdx + idx}]`}
            required={schema.required}
            schema={schema.items[idx]}
            data={d}
            uiSchema={(uiSchema.items || [])[idx]}
            {...rest}
          />);
        }
        return null;
      })}
      {(!isArray(schema.items) && schema.uniqueItems && schema.items.enum) && schema.items.enum.map(d => (<FormField
        key={`${path}[${d}]` // eslint-disable-line react/no-array-index-key
        }
        path={`${path}`}
        required={schema.required}
        schema={{ ...schema.items, title: d }}
        data={includes(data, d)}
        uiSchema={uiSchema}
        {...rest}
      />))}
      {schema.additionalItems &&
        <FieldSetArray
          path={path}
          startIdx={2}
          required={schema.required}
          schema={{ type: 'array', items: schema.additionalItems }}
          data={slice(data, schema.items.length)}
          uiSchema={uiSchema.additionalItems}
          onMoveItemUp={onMoveItemUp}
          onMoveItemDown={onMoveItemDown}
          onDeleteItem={onDeleteItem}
          {...rest}
        />
      }
    </div>
  );
};
export const FieldSetArray = withStyles(fieldSetStyles.fieldSetArray)(RawFieldSetArray);

export const RawFieldSetObject = ({ className, classes, schema = {}, uiSchema = {}, data = {}, path, ...rest }) => {
  const orientation = (uiSchema['ui:orientation'] === 'row' ? classes.row : null);
  return (
    <div className={classNames(classes.root, orientation)}>
      {keys(schema.properties).map((p) => {
        const newPath = path ? `${path}.${p}` : p;
        return (
          <FormField
            key={p}
            objectData={data}
            path={newPath}
            required={schema.required}
            schema={schema.properties[p]}
            data={data[p]}
            uiSchema={uiSchema[p] || {}}
            {...rest}
          />
        );
      })}
    </div>
  );
};
export const FieldSetObject = withStyles(fieldSetStyles.fieldSetObject)(RawFieldSetObject);

export const RawFieldSetContent = (props) => {
  const { schema = {} } = props;
  const { type } = schema;
  if (type === 'array') {
    return <FieldSetArray {...props} />;
  }
  else if (type === 'object') {
    return <FieldSetObject {...props} />;
  }
  return null;
};
export const FieldSetContent = withStyles(fieldSetStyles.fieldSetContent)(RawFieldSetContent);


// for unit testing
export const RawFieldSet = (props) => {
  const { className, path, classes, schema = {} } = props;
  return (
    <fieldset className={classNames(className, classes.root, { [classes.listItem]: endsWith(path, ']') })}>
      {schema.title &&
        <InputLabel>{schema.title}</InputLabel>
      }
      <FieldSetContent path={path} {...props} />
    </fieldset>
  );
};

export default withStyles(fieldSetStyles.fieldSet)(RawFieldSet);
