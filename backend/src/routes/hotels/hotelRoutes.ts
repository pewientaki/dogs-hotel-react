const express = require('express'),
	router = express.Router(),
	Hotel = require('../models/hotel'),
	middleware = require('../middleware');

router.get('/', function(req: any, res: any) {
	//Get all hotels from the DB
	Hotel.find({}, function(err: any, allHotels: any) {
		if (err) {
			console.log(err);
		} else {
            // res.render('hotels/index', { hotels: allHotels });
            res.status(200).json({
                data: allHotels
            })
		}
	});
});

// CREATE - add new hotel to DB
router.post('/', middleware.isLoggedIn, function(req: any, res: any) {
	//get data from the form and add to hotels array
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newHotel = { name: name, price: price, image: image, description: desc, author: author };
	// Create a new hotel and save it to the DB
	Hotel.create(newHotel, function(err: any, newlyCreated: any) {
		if (err) {
			req.flash('error', 'Something went wrong.. :(');
			console.log(err);
		} else {
			console.log(newlyCreated);
			// redirect back to the hotels page
			req.flash('success', 'You have added a new hotel, thank you!');
			res.redirect('/hotels');
		}
	});
});

// NEW - show form to create new hotels
router.get('/new', middleware.isLoggedIn, function(req: any, res: any) {
    // res.render('hotels/new');
});

// SHOW
router.get('/:id', function(req: any, res: any) {
	Hotel.findById(req.params.id).populate('comments').exec(function(err: any, foundHotel: any) {
		if (err) {
			console.log(err);
		} else {
            // res.render('hotels/show', { hotel: foundHotel });
            res.status(200).json({
                data: foundHotel
            })
		}
	});
});

// EDIT hotel route
router.get('/:id/edit', middleware.checkHotelsOwnership, function(req: any, res: any) {
	Hotel.findById(req.params.id, function(err: any, foundHotel: any) {
		//pass hotel data found by ID
        // res.render('hotels/edit', { hotel: foundHotel });
        res.status(200).json({
            data: foundHotel
        }); 
	});
});

// UPDATE hotel route
router.put('/:id', middleware.checkHotelsOwnership, function(req: any, res: any) {
	// find and update the correct hotel & redirect
	Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err: any, updatedHotel: any) {
		if (err) {
			res.redirect('/hotels');
		} else {
			res.redirect('/hotels/' + req.params.id);
		}
	});
});
// DESTROY hotel route
router.delete('/:id', middleware.checkHotelsOwnership, function(req: any, res: any) {
	Hotel.findByIdAndRemove(req.params.id, function(err: any) {
		if (err) {
			res.redirect('/hotels');
		} else {
			req.flash('success', 'You have removed the hotel (' + Hotel.name + ')');
			res.redirect('/hotels');
		}
	});
});

module.exports = router;