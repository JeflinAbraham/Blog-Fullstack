import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl mt-7 font-medium text-orange-500 italic'>Create a post</h1>
            <form className='flex flex-col gap-4 mt-7'>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='w-3/4'
                    />
                    <Select>
                        <option value='uncategorized'>Select a category</option>
                        <option value='bikes'>bikes</option>
                        <option value='buildings'>buildings</option>
                        <option value='cars'>cars</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border p-4'>
                    <FileInput type='file' accept='image/*' />
                    <Button
                        gradientDuoTone='pinkToOrange'
                        size='sm'
                        outline
                    >
                        Upload image
                    </Button>
                </div>
                <ReactQuill
                    theme='snow'
                    placeholder='Write something...'
                    className='h-96 mb-12'
                    required
                />
                <Button type='submit' gradientDuoTone='pinkToOrange'>
                    Publish
                </Button>
            </form>
        </div>
    );
}