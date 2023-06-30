import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarPickerView } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enLocale from "date-fns/locale/en-US";
import { IFieldProps } from "../../common/field";
import { FormUtils, MSGS } from "@manojadams/metaforms-core";
import { TextField, TextFieldVariants } from "@mui/material";
import MuiFormUtil from "../../Utils/MuiFormUtil";

function DateControl(props: IFieldProps) {
    const label = MuiFormUtil.getDisplayLabel(props.form);
    const dateString = props.form?.value ? props.form.value + "" : "";
    const value = props.form?.value ? new Date(dateString) : null;
    const variant = props.variant;
    const min = props.form.validation?.min ? new Date(props.form.validation.min) : undefined;
    const max = props.form.validation?.max ? new Date(props.form.validation.max) : undefined;
    const openTo: CalendarPickerView = (props.form?.config?.openTo as CalendarPickerView | undefined) || "day";
    const inputFormat = props.form?.config?.inputFormat || "dd/MM/yyyy";
    const views: [CalendarPickerView] = (props.form?.config?.views as [CalendarPickerView] | undefined) || ["day"];
    const subProps = props || {};
    let localValue;
    const wrapperClassName = "meta-form-control-" + props.field.name;
    const placeholder = props.form.placeholder || inputFormat;
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
            <DatePicker
                {...subProps}
                disabled={props.form.isDisabled}
                readOnly={props.form.isReadonly}
                label={label}
                value={localValue || value}
                views={views}
                openTo={openTo}
                inputFormat={inputFormat}
                minDate={min}
                maxDate={max}
                PopperProps={{
                    className: "meta-form-date-picker"
                }}
                onChange={(val: Date | null, inputString: string) => {
                    if (val === null && inputString === undefined) {
                        // input field is cleared
                        props.handleChange(null, "");
                    } else if (inputString === undefined) {
                        // popup is used
                        if (val) {
                            props.handleChange(null, FormUtils.getDateString(val));
                        } else {
                            props.handleChange(null, "");
                        }
                    } else {
                        // input field is used
                        // check input format
                        if (val && inputString && inputString.length === inputFormat.length) {
                            const inputDate = Date.parse(inputString);
                            if (isNaN(inputDate)) {
                                props.setError(true, MSGS.ERROR_MSG.DATE_INVALID);
                            } else {
                                props.handleChange(null, FormUtils.getDateString(new Date(inputDate)));
                            }
                        } else {
                            localValue = val;
                        }
                    }
                }}
                // eslint-disable-next-line react/jsx-no-bind
                onClose={props.handleValidation}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant={variant as TextFieldVariants}
                        className={wrapperClassName}
                        helperText={props.error.errorMsg || undefined}
                        inputProps={{
                            ...params.inputProps,
                            placeholder
                        }}
                        // eslint-disable-next-line react/jsx-no-bind
                        onBlur={props.handleValidation}
                        size={props.size}
                        error={props.error?.hasError ? true : undefined}
                        fullWidth
                    />
                )}
            />
        </LocalizationProvider>
    );
}

export default DateControl;
