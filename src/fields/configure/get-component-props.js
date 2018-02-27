
import getMuiProps from './get-mui-props';
import getInputType from './get-input-type';
import valuesToOptions from './values-to-options';

const coerceValue = (type, value) => {
  switch (type) {
    case 'string':
      return (typeof value === 'string' ? value : String(value));
    case 'number':
    case 'integer':
    case 'double':
    case 'float':
    case 'decimal':
      return Number(value);
    default:
      return value;
  }
};
const onChangeHandler = (onChange, type) => e => onChange && onChange(coerceValue(type, e.target.value));

export default ({ schema = {}, uiSchema = {}, onChange, htmlId }) => {
  const widget = uiSchema['ui:widget'];
  const options = uiSchema['ui:options'] || {};
  const { type } = schema;
  const rv = {
    type: getInputType(type, uiSchema),
    onChange: onChange && onChangeHandler(onChange, type),
    ...getMuiProps(uiSchema),
  };
  if (schema.enum) {
    if (widget === 'radio' || options.inline) {
      rv.row = true;
    }
    rv.options = valuesToOptions(schema.enum);
    rv.nullOption = 'Please select...';
  }
  else if (type === 'boolean') {
    rv.label = schema.title;
    rv.onChange = onChange;
  }
  else {
    rv.inputProps = {
      id: htmlId,
    };
  }
  if (widget === 'textarea') {
    rv.multiline = true;
    rv.rows = 5;
  }
  return rv;
};
