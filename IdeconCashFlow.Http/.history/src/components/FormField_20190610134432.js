import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { currencyType } from '../utils/helper';
import { InputAdornment, Select, Switch, Button ,SelectField,MenuItem,FormHelperText,InputLabel,FormControl,TextField} from "@material-ui/core/index";
import AutoComponentSelect from './common/AutoComponentSelect';
import CreatableSelect from "react-select/lib/Creatable";
import moment from 'moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";

import "moment/locale/en-gb";
import "moment/locale/tr";

import { FormattedMessage, injectIntl } from "react-intl";

const validate = values => {
    const errors = {};
  
    if (!values.currency) {
      errors.currency = 'Lütfen bir adres girin!';

    return errors;
  };




const renderSelectField = ({
    input,
    label,
    options,
    meta: { touched, error },
    children,
    value,
    handleChange,
    ...custom
  }) => (
      <>
    <InputLabel>{label}</InputLabel>  
    <AutoComponentSelect
      errorText={touched && error}
      handleChange={handleChange}
      children={children}
      options={options}
      value={value}
    />
    </>
  )

  const renderTextField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
  }) => (
    <TextField
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />
  )


const FormFields = props => {
    const {
        handleSubmit,
        pristine,
        reset,
        submitting,
        flowDirectionsOptions,
        handleFlowDirectionChange,
        currenciesOptions,
        handleCurrencyChange,
        mainTitleOptions,
        handleMainTitleChange,
        handleSubTitleChange,

    } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="card-header header-elements-inline">
                <h6 className="card-title">Custom background</h6>
                <div className="header-elements">
                    <div className="list-icons">
                        <i className="fas fa-eraser" />
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="row">
                    <div className="col-sm-6">
                        <Field
                            name="flowDirection"
                            component={renderSelectField}
                            label="Akış Yönü"
                            options={flowDirectionsOptions}
                            handleChange={handleFlowDirectionChange}
                        />
                    </div>
                    <div className="col-sm-6">
                        <Field
                            name="currency"
                            component={renderSelectField}
                            label="Para birimi"
                            options={currenciesOptions}
                            handleChange={handleCurrencyChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Başlık Seçimi:</label>
                    <CreatableSelect
                        name="mainTitle"
                        placeholder="Seçim yapınız"
                        options={mainTitleOptions}
                        createOptionPosition="last"
                        formatCreateLabel={() => "Yeni başlık oluştur..."}
                        onCreateOption={this.newMainTitle}
                        onChange={handleMainTitleChange}
                    />
                </div>
                <div className="form-group">
                    <Field
                        name="subTitle"
                        component={renderTextField}
                        label="Alt Başlık"
                        handleChange={handleSubTitleChange}
                    />
                </div>


                <div className="row mt-5">
                    <div className="col-sm-6">
                        <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} >
                            <KeyboardDatePicker
                                format="DD/MM/YYYY"
                                name="startDate"
                                minDate={new Date()}
                                label={<FormattedMessage id="date.start" />}
                                value={this.state.startDate}
                                disabled={this.state.mainTitle.isDue}
                                onChange={this.handleChange}
                                invalidDateMessage='uygunsuz'
                                minDateMessage='asdas'
                                invalidLabel="gatalı"
                                emptyLabel={moment(new Date()).format('DD/MM/YYYY')}
                            />
                        </MuiPickersUtilsProvider>
                    </div>
                    <div className="col-sm-6">

                        {/* <TextValidator
                                                name="amount"
                                                label="Tutar"
                                                className="form-control"
                                                {...control(this, "amount", (e) => {
                                                    return e.target.value;
                                                })}
                                                validators={['required']}
                                                errorMessages={['this field is required']}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <span>{currencyType(currency.value).symbol}</span>
                                                        </InputAdornment>
                                                    ),
                                                    inputComponent: NumberFormat,
                                                }}
                                            /> */}
                    </div>
                </div>
            </div>

            <div className="card-footer d-flex justify-content-between align-items-center bg-teal-400 border-top-0">
                <p className="legitRipple" />
                <button
                    type="submit"
                    className="btn btn-outline bg-white text-white border-white border-2 legitRipple"
                >
                    Kaydet <i className="icon-paperplane ml-2" />
                </button>
            </div>
        </form>
    );
};

FormFields.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    onSearch: PropTypes.func.isRequired,
    productsSelectedForReturn: PropTypes.arrayOf(PropTypes.any).isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    changeCount: PropTypes.func.isRequired,
    noSelectedProduct: PropTypes.string,
};
FormFields.defaultProps = {
    noSelectedProduct: null,
};

const mapStateToProps = state => ({});
const mapDispatchToProps = {};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: 'ProductReturn',
        validate,
    })(FormFields),
);










<form onSubmit={handleSubmit}>
    <div className="row">
        <div className="col-md-4">
            <Field
                required
                label="Fatura Tarihi"
                name="invoiceDate"
                component={RenderDatepicker}
                max={moment()}
            />
        </div>
        <div className="col-md-4">
            <Field
                required
                label="Fatura Numarası"
                name="invoiceNumber"
                component={RenderInput}
                type="text"
            />
        </div>

        <div className="col-md-4">
            <Field
                placeholder="İade Nedeni Seçin.."
                required
                label="İade Nedeni"
                name="reasonForReturn"
                component={RenderSelect}
                options={[
                    { value: '1', label: 'Yanlış Sipariş Girişi' },
                    { value: '2', label: 'Ürün Hasarlı / Arızalı' },
                    { value: '3', label: 'Hatalı Sevkiyat' },
                ]}
            />
        </div>
        <div className="col-md-12">
            <hr />

            <div className="row">
                <div className="col-md-7">
                    <label>Lütfen Malzeme No ile arama yapın</label>
                    <Async
                        defaultOptions={[
                            { value: '', label: 'Lütfen Malzeme No ile arama yapın', isDisabled: true },
                        ]}
                        value=""
                        placeholder="Malzeme No Ara.."
                        loadOptions={_.debounce(onSearch, 500)}
                        onChange={addItem}
                        menuPlacement="auto"
                        styles={{
                            control: styles => ({
                                ...styles,
                                borderColor: noSelectedProduct ? '#dc3645' : '#d9d9d9',
                                backgroundColor: 'white',
                            }),
                        }}
                        components={components}
                        loadingMessage={searchText => `${searchText.inputValue} aranıyor..`}
                        noOptionsMessage={searchText =>
                            `${searchText.inputValue} numarasına ait herhangi bir malzeme bulunamadı..`
                        }
                    />
                    <div className="invalid-feedback errorField">
                        <span>{noSelectedProduct}</span>
                    </div>
                </div>

                <div className="col-md-12">
                    {productsSelectedForReturn.length > 0 && (
                        <div>
                            <div className="gap gap-small" />
                            <h5>İade Listesi</h5>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Malzeme No.</th>
                                        <th scope="col">Malzeme Adı</th>
                                        <th scope="col">Miktarı</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {productsSelectedForReturn.map((item, i) => (
                                        <tr key={i}>
                                            <th className="align-middle" scope="row">
                                                {i + 1}
                                            </th>
                                            <td className="align-middle">{item.product.productId}</td>
                                            <td className="align-middle">{item.product.title}</td>
                                            <td className="align-middle">
                                                <div className="changeCount">
                                                    <NumericInput
                                                        style={false}
                                                        min={1}
                                                        onChange={e => changeCount(item.product.productId, e)}
                                                        value={item.count}
                                                    />
                                                </div>
                                            </td>
                                            <td className="align-middle">
                                                <div
                                                    className="removeButton pointer"
                                                    onClick={removeItem(item.product.productId)}
                                                >
                                                    <i className="fa fa-times c-red" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    <div className="gap gap-small" />

    <h5>
        <strong>İade Şartları</strong>
    </h5>
    <ol type="1">
        <li>İade işlemi fatura tarihinden itibaren en geç 7 gün içinde yapılmalıdır.</li>
        <li>
            Fatura tarihinden itibaren 7 gün içinde yapılmayan iade işlemleri için (iade nedeni Ürün
            Hasarlı/Arızalı hariç) fatura bedeli üzerinden %10 cezai yaptırım uygulanır.
          </li>
        <li>
            Fatura tarihinden itibaren 30 günü geçmiş olan ürünler (iade nedeni Ürün Hasarlı/Arızalı
            hariç) tarafımızdan iade alınmamaktadır.
          </li>
        <li>
            Ürün, Hasarlı/Arızalı çıkmışsa iade işlemi en geç fatura tarihinden itibaren 180 gün
            içinde yapılmalıdır. Aksi halde iade alınmamaktadır.
          </li>
        <li>
            Asgari sipariş miktarlı ürünler; asgari sipariş miktarı ve katları şeklinde iade
            edilmelidir. (Örn. Asgari sipariş miktarı 5 olan bir ürün; 5,10,15,20 adet şeklinde iade
            edilebilir.)
          </li>
        <li>
            Farklı tarih ve faturalarda alınan ürünlerin iadesinde; alınan her bir fatura için ayrı
            iade formu doldurulmalıdır.
          </li>
    </ol>
    <span className="c-red">
        <strong>Not:</strong> İade işlem formunun onayı gelene kadar lütfen faturayı kesmeyiniz ve
        ürünü göndermeyiniz.
        </span>
    <div className="gap gap-small" />

    <div>
        <button className="m-r-5 c-btn-green" type="submit" disabled={pristine || submitting}>
            <i className="fas fa-check-circle" /> Talebi Gönder
          </button>

        {/*  <button
            className="m-r-5 c-btn-orange"
            type="submit"
            disabled={pristine || submitting}
            onClick={reset}
          >
            <i className="fas fa-eraser" /> Formu Temizle
          </button> */}
    </div>
</form>