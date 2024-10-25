    const dt = require("./banco")
    const agendamentos = dt.sequelize.define("agendamento",{
        nome:{
            type: dt.Sequelize.STRING
        },
        telefone:{
            type: dt.Sequelize.STRING
        },
        origem:{
            type: dt.Sequelize.STRING
        },
        data_contato:{
            type: dt.Sequelize.DATE
        },
        observacao:{
            type: dt.Sequelize.TEXT
        }
    })
    //agendamentos.sync({force: true})
    module.exports = agendamentos