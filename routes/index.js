var express = require('express');
var router = express.Router();
const sqlite = require('sqlite3').verbose();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/albums', function(req, res, next) {
  models.albums.findAll({
    where: {
      Deleted: null
    }
  }).then(albumsFound => {
    res.render('albums', {
      albums: albumsFound
    });
  });
});

router.post('/albums', (req, res) => {
  models.artists
  .findOrCreate({
    where: {
      Name: req.body.artist
    }
  }).spread(function(result, created) {
    models.albums.
    findOrCreate({
      where: {
      Title: req.body.title,
      ArtistId: result.ArtistId,
      YearReleased: req.body.yearReleased
      }
    }).spread(function(result, created) {
      if (created) {
        res.redirect('/albums');
      } else {
        res.send('Album already exists');
      }
    });
  });
});
router.get('/albums/:id', (req, res) => {
  let albumId = parseInt(req.params.id);
  models.albums
    .find({
      where: {
        AlbumId: albumId
      },
      include: [models.artists]
    })
    .then(album => {
      res.render('specificAlbum', {
        Title: album.Title,
        YearReleased: album.YearReleased,
        Name: album.artist.Name,
        AlbumId: album.AlbumId
      });
    });
});

router.put('/albums/:id', (req, res) => {
  let albumId = parseInt(req.params.id);
  models.albums.update({
        Title: req.body.title,
        YearReleased: req.body.yearReleased
      }, 
      {
        where: {
          AlbumId: albumId
        }
      }
    ).then(result => {
      res.send();
    });
});

router.delete('/albums/:id/delete', (req, res) => {
  let albumId = parseInt(req.params.id);
  models.tracks
  .update(
    {
      Deleted: 'true'
    }, 
    {
      where: {
        AlbumId: albumId
      }
    }
  )
  .then(track => {
    models.albums
      .update(
        {
          Deleted: 'true'
        },
        {
          where: {
            AlbumId: albumId
          }
        }
      )
      .then(album => {
        res.redirect('/albums');
      });
  });
});

router.get('/employees', (req, res, next) => {
  models.employees
  .findAll({
    where: {
      Deleted: null
    }
  }).then(employeesFound => {
    res.render('employees', {
      employees: employeesFound
    });
  });
});

router.get('/employees/:id', (req, res) => {
  let employeeId = req.params.id;
  models.employees
  .find({
    where: 
    {
      EmployeeId: employeeId
    },
  })
  .then(employee => {
    res.render('specificEmployee', {
      EmployeeId: employee.EmployeeId,
      FirstName: employee.FirstName,
      LastName: employee.LastName
    });
  });
});

router.put('/employees/:id', (req, res) => {
  let employeeId = parseInt(req.params.id);
  models.employees.update({
    FirstName: req.body.FirstName, 
    LastName: req.body.LastName
    }, 
    {
      where: {
        EmployeeId: employeeId
      }
    })
    .then(result => {
      res.send();
    });

});

router.delete('/employees/:id/delete', (req, res) => {
  let employeeId = parseInt(req.params.id);
  models.employees
  .update(
    {
      Deleted: 'true'
    },
    {
      where: {
        EmployeeId: employeeId
      }
    }
  
  )
  .then(employee => {
    res.redirect('/employees');
  });
});

// router.post('/employees', (req, res) => {
//   models.employees
//   .findOrCreate({
//     where: {
//      FirstName: req.body.FirstName, 
//      LastName: req.body.LastName
//     }
//   }).spread(function(result, created) {
//       if (created) {
//         res.redirect('/employees');
//       } else {
//         res.send('Employee already exists');
//       }
//     });
//   });



module.exports = router;
