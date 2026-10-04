import {
  getProfile,
  updateProfile
} from "../services/authService.js";

// Get profile
export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await getProfile(req.user._id);

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
export const updateMyProfile = async (req, res, next) => {
  try {
    const profile = await updateProfile(
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile
    });
  } catch (error) {
    next(error);
  }
};