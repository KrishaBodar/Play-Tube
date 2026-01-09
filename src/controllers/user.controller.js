import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {

    // Registration logic here
    // steps for registre user
    // get user details from frontend
    // validate user details -not empty, valid email format, password strength
    // check if user already exists in database: username or email
    // check for images and avatar upload if any
    // upload them to cloudinary or any other service
    // create user object - create entry in const {propertyName} = objectToDestruct;
    // remove password and refreshToken from user object before sending response
    // check for user creation 
    // return response with success message and user details (without password and refreshToken)




    // get user details from frontend
    const {fullname, email, username, password} = req.body;
    console.log("email:", email);

    // validate user details -not empty, valid email format, password strength
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }

    // check if user already exists in database: username or email
    const existedUser = await User.findOne({ 
        $or: [{ email }, { username }] 
    });

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
   
    if ( !avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars");
    const coverImage = await uploadOnCloudinary(coverImageLocalPath, "coverImages");

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar image");
    }

    //datbase entry
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password,
    });

    const createdUser  = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered successfully")
        );




});




export { registerUser };