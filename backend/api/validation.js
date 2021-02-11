module.exports = app => {

    function exists(value, msg) {
        if (!value) throw msg
        if (Array.isArray(value) && value.length === 0) throw msg
        if (typeof value === 'string' && !value.trim()) throw msg
    }

    function notExists(value, msg) {
        try {
            exists(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }

    function equals(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }

    function validateDriver(driver) {
        let result = {
            status: null,
            message: null
        }
        try {
            exists(driver.cpf, 'CPF não informado')
            exists(driver.name, 'Nome não informado')
            exists(driver.ini_date, 'Data de admissão não informada')
        } catch (msg) {
            result.status = 400
            result.message = msg
        }
        return result
    }

    function validatePartner(partner) {
        let result = {
            status: null,
            message: null
        }
        try {
            exists(partner.cpf_cnpj, 'CPF ou CNPJ não informado')
            exists(partner.partner_type, 'Tipo não informado')
            exists(partner.name, 'Nome não informado')
            exists(partner.partner_name, 'Nome não informado')
            exists(partner.adress, 'Endereço não informado')
        } catch (msg) {
            result.status = 400
            result.message = msg
        }
        return result
    }

    function validateDocument(document) {
        let result = {
            status: null,
            message: null
        }
        try {
            exists(document.branch, 'Filial não informada')
            exists(document.serie, 'Série não informada')
            exists(document.number, 'Número não informado')
            exists(document.percentage, 'Percentual da viagem não informado ou com valor zero')
            exists(document.doc_date, 'Data Documento não informada')
            exists(document.nfe_date, 'Data NFE não informada')
            exists(document.traveling_number, 'Número da Viagem não informado')
            exists(document.doc_type, 'Tipo Documento não informado')
            exists(document.weight, 'Peso não informado')
            exists(document.code_client, 'Cliente não informado')
            exists(document.code_sender, 'Remetente não informado')
            exists(document.code_recipient, 'Destinatário não informado')
            exists(document.cpf, 'CPF não informado')
        } catch (msg) {
            result.status = 400
            result.message = msg
        }
        return result
    }

    return { exists, notExists, equals, validateDriver, validatePartner, validateDocument }
}