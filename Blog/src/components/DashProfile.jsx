import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    // initialize Firebase Storage.
    const storage = getStorage(app);

    // Concatenating the timestamp and original file name ensures that each file uploaded has a unique name, preventing overwriting.
    const fileName = new Date().getTime() + imageFile.name;

    // creates a reference to a specefic location in the firebase storage where the file needs to be stored. 
    const storageRef = ref(storage, fileName);

    // uploadTask.on('state_changed', ...): Adds an event listener for the state_changed event on the uploadTask. This event is triggered whenever the state of the upload changes (eg. progress, errors, completion).
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      // snapshot: An object representing the current state of the upload.
      (snapshot) => {
        // snapshot.bytesTransferred: The number of bytes that have been uploaded so far.
        //Calculates the upload progress as percentage.
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        //setImageFileUploadProgress(progress.toFixed(0));: Updates the state with the current upload progress, rounding the value to the nearest whole number using toFixed(0). (eg: 37.64 -> 38).
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.log("hjii");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },

      // This function is executed when the upload completes successfully.
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Updates the state with the download URL, allowing the uploaded file to be accessed via this URL.
          setImageFileUrl(downloadURL);

          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    //setFormData updates formData only when the password/username fields change.
    if (Object.keys(formData).length === 0 && !imageFile) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
    setFormData({});
    setImageFile(null);
  };
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>My profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        {/* image and progress bar */}
        {/* This div acts as a clickable area to trigger the hidden file input element. */}
        <div
          className='relative w-32 h-32 self-center cursor-pointer rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: 'rgb(255,126,0)',
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            className={`rounded-full w-full h-full object-cover border-8 border-orange-500 ${imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-30'
              }`}
          />
        </div>
        <TextInput
          type='text'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          defaultValue={currentUser.email}
          readOnly
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button type='submit' gradientDuoTone='pinkToOrange' outline>
          Update
        </Button>
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>

      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
    </div>
  );
}
