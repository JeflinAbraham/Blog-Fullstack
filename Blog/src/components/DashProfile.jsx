import { Alert, Button, TextInput, Modal, ModalBody } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
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
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signInFailure,
  signoutSuccess,
  signoutFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser, error: errormsg, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const [formData, setFormData] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [showModalSignOut ,setShowModalSignOut] = useState(false);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    // e.target.files is an array contatining the files uploaded by user.
    // e.target.files[0], we assume user uploaded just one file.
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
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

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // uploadTask.on('state_changed', ...): Adds an event listener for the state_changed event on the uploadTask. This event is triggered whenever the state of the upload changes (eg. progress, errors, completion).
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

          // the formData ll have password/username fields if they are updated, along with that we add another field profilePicture to the formData. the form ui is temporarily updated.
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

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    try {
      dispatch(updateStart());

      //using the formData(username,password,profilePicture) we update the database.
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
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      }
      else {
        dispatch(deleteUserSuccess());
      }
    }
    catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signoutFailure(data.message));
      } else {
        dispatch(signoutSuccess());
      }
    }
    catch (error) {
      signoutFailure(data.message);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-8 w-full border-1 shadow-lg shadow-slate-500 dark:shadow-orange-800 h-[605px] mt-10'>
      <h1 className='my-7 text-center font-semibold text-3xl'>My profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        {/* This div acts as a clickable area to trigger the hidden file input element. */}
        <div
          className='relative w-32 h-32 self-center cursor-pointer rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {/* if imageFileUploadProgress != 0, show the circular progress bar */}
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
        <Button type='submit' gradientDuoTone='pinkToOrange' outline disabled={loading || imageFileUploading}>
          Update
        </Button>

        {/* if the user is admin, display the create-post button */}
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              gradientDuoTone='pinkToOrange'
              className='w-full'
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={() => setShowModalSignOut(true)}>Sign Out</span>
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
      {errormsg && (
        <Alert color='failure' className='mt-5'>
          {errormsg}
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Body className='p-4'>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>


      <Modal
        show={showModalSignOut}
        onClose={() => setShowModalSignOut(false)}
        popup
        size='md'
      >
        <Modal.Body className='p-4'>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to sign out?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleSignout}>
                Yes, Sign out
              </Button>
              <Button color='gray' onClick={() => setShowModalSignOut(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>




  );
}
