import {DataTypes} from "sequelize";

const getToySubscriberModel = sequelize => {
    const ToySubscriber = sequelize.define('toySubscriber', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ratePrice: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sale: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        tokens: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        fromRef: {
            type: DataTypes.STRING,
        },
        startSubscription: {
            type: DataTypes.DATE,
            allowNull: true
        },
        endSubscription: {
            type: DataTypes.DATE,
            allowNull: true
        },
        activeToys: {
            type: DataTypes.JSON,
            allowNull: true
        },
        comment: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })

    return ToySubscriber
}

export default getToySubscriberModel