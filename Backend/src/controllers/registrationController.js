const Registration = require('../models/Registration');
const { validationResult } = require('express-validator');

// Create new registration
exports.createRegistration = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if files are uploaded
    if (!req.files || !req.files.nicFront || !req.files.nicBack || !req.files.schoolImage) {
      return res.status(400).json({ 
        message: 'Please upload all required documents' 
      });
    }

    // Extract file paths
    const nicFront = req.files.nicFront[0].path.replace(/\\/g, '/');
    const nicBack = req.files.nicBack[0].path.replace(/\\/g, '/');
    const schoolImage = req.files.schoolImage[0].path.replace(/\\/g, '/');

    // Create registration data
    const registrationData = {
      ...req.body,
      nicFront,
      nicBack,
      schoolImage,
      dateOfBirth: new Date(req.body.dateOfBirth)
    };

    // Check if NIC already exists
    const existingRegistration = await Registration.findOne({ 
      nicNumber: req.body.nicNumber 
    });

    if (existingRegistration) {
      return res.status(400).json({ 
        message: 'NIC number already registered' 
      });
    }

    // Save registration
    const registration = new Registration(registrationData);
    await registration.save();

    res.status(201).json({
      message: 'Registration created successfully',
      registration: {
        id: registration._id,
        firstName: registration.firstName,
        lastName: registration.lastName,
        status: registration.status
      }
    });

  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ 
      message: 'Error creating registration',
      error: error.message 
    });
  }
};

// Get all registrations
exports.getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: registrations.length,
      registrations
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ 
      message: 'Error fetching registrations',
      error: error.message 
    });
  }
};

// Get single registration
exports.getRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .select('-__v');

    if (!registration) {
      return res.status(404).json({ 
        message: 'Registration not found' 
      });
    }

    res.status(200).json({
      registration
    });

  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ 
      message: 'Error fetching registration',
      error: error.message 
    });
  }
};

// Update registration
exports.updateRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ 
        message: 'Registration not found' 
      });
    }

    // Update fields
    const updateData = { ...req.body };
    
    // If files are uploaded, update file paths
    if (req.files) {
      if (req.files.nicFront) {
        updateData.nicFront = req.files.nicFront[0].path.replace(/\\/g, '/');
      }
      if (req.files.nicBack) {
        updateData.nicBack = req.files.nicBack[0].path.replace(/\\/g, '/');
      }
      if (req.files.schoolImage) {
        updateData.schoolImage = req.files.schoolImage[0].path.replace(/\\/g, '/');
      }
    }

    const updatedRegistration = await Registration.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    res.status(200).json({
      message: 'Registration updated successfully',
      registration: updatedRegistration
    });

  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(500).json({ 
      message: 'Error updating registration',
      error: error.message 
    });
  }
};

// Delete registration
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({ 
        message: 'Registration not found' 
      });
    }

    res.status(200).json({
      message: 'Registration deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ 
      message: 'Error deleting registration',
      error: error.message 
    });
  }
};

// Update registration status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status value' 
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-__v');

    if (!registration) {
      return res.status(404).json({ 
        message: 'Registration not found' 
      });
    }

    res.status(200).json({
      message: 'Status updated successfully',
      registration
    });

  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ 
      message: 'Error updating status',
      error: error.message 
    });
  }
};