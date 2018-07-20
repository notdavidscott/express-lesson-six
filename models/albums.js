'use strict';
module.exports = (sequelize, DataTypes) => {
    const albums = sequelize.define(
        'albums', 
        {
            AlbumId: {
                type: DataTypes.INTEGER,
                autoIncrement: true, 
                primaryKey: true
            }, 
            Title: DataTypes.STRING, 
            ArtistId: DataTypes.INTEGER,
            YearReleased: DataTypes.INTEGER,
            Deleted: DataTypes.BOOLEAN
        },
        {
            timestamps: false
        }
    );
    //This is showing the associations this model has to any other models. 
    //Because the ArtistId column in the albums table relates to the ArtistId 
    //in the artists table, you need that association. This also defines any 
    //foreign key's that exist in tables.
    albums.associate = function(models) { 
        albums.belongsTo(models.artists, { //model being associated with
            foreignKey: 'ArtistId'
        });
        albums.hasMany(models.tracks, {
            foreignKey: 'AlbumId'
        });
    };
    return albums;
};