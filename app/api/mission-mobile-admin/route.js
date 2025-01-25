import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllMissionMobileItems, addMissionMobileItem } from '../../../lib/missionMobile';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/missionMobile');

export const GET = async (req) => {
  try {
    // console.log('Fetching all mission mobile items...');
    const items = await getAllMissionMobileItems();
    // console.log('Successfully fetched items:', items);
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    // console.error('Error fetching mission mobile items:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch mission mobile items' }, { status: 500 });
  }
};

export const POST = async (req) => {
  const formData = await req.formData();
  
  // console.log('Received form data:', formData);

  const pioneerTitle = formData.get('pioneerTitle');
  const pioneerSubtitle = formData.get('pioneerSubtitle');
  const imageTitle1 = formData.get('imageTitle1');
  const imageTitle2 = formData.get('imageTitle2');
  const imageTitle3 = formData.get('imageTitle3');
  const imageTitle4 = formData.get('imageTitle4');
  const imageTitle5 = formData.get('imageTitle5');
  const smallImage1 = formData.get('smallImage1');
  const smallImage2 = formData.get('smallImage2');
  const smallImage3 = formData.get('smallImage3');
  const smallImage4 = formData.get('smallImage4');
  const image1 = formData.get('image1');
  const image2 = formData.get('image2');
  const image3 = formData.get('image3');
  const image4 = formData.get('image4');
  const image5 = formData.get('image5');
  const logo = formData.get('logo');
  const smallLogo = formData.get('smallLogo');

  // Validate inputs
  if (
    !pioneerTitle || !pioneerSubtitle || 
    !imageTitle1 || !imageTitle2 || !imageTitle3 || !imageTitle4 || !imageTitle5 ||
    !smallImage1 || !smallImage2 || !smallImage3 || !smallImage4 ||
    !image1 || !image2 || !image3 || !image4 || !image5 ||
    !logo || !smallLogo
  ) {
    // console.error('Validation failed: Missing required fields');
    return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    // console.log('Upload directory does not exist. Creating directory...');
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Generate timestamp to add to filenames for uniqueness
  const timestamp = Date.now();
  // console.log('Generated timestamp for unique filenames:', timestamp);

  // Save all image files with timestamped names
  const saveImage = async (image, namePrefix) => {
    const imageExtension = path.extname(image.name);
    const imageName = `${path.basename(image.name, imageExtension)}_${namePrefix}_${timestamp}${imageExtension}`;
    const imagePath = path.join(UPLOAD_DIR, imageName);
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);
    // console.log(`Image saved: ${imagePath}`);
    return `/uploads/missionMobile/${imageName}`;
  };

  try {
    // console.log('Saving small images...');
    const savedSmallImages = await Promise.all([
      saveImage(smallImage1, 'small1'),
      saveImage(smallImage2, 'small2'),
      saveImage(smallImage3, 'small3'),
      saveImage(smallImage4, 'small4')
    ]);
    // console.log('Small images saved:', savedSmallImages);

    // console.log('Saving main images...');
    const savedImages = await Promise.all([
      saveImage(image1, 'image1'),
      saveImage(image2, 'image2'),
      saveImage(image3, 'image3'),
      saveImage(image4, 'image4'),
      saveImage(image5, 'image5')
    ]);
    // console.log('Main images saved:', savedImages);

    // console.log('Saving logos...');
    const savedLogo = await saveImage(logo, 'logo');
    const savedSmallLogo = await saveImage(smallLogo, 'smallLogo');
    // console.log('Logos saved:', savedLogo, savedSmallLogo);

    const missionMobileItem = {
      pioneerTitle,
      pioneerSubtitle,
      imageTitle1,
      imageTitle2,
      imageTitle3,
      imageTitle4,
      imageTitle5,
      smallImage1: savedSmallImages[0],
      smallImage2: savedSmallImages[1],
      smallImage3: savedSmallImages[2],
      smallImage4: savedSmallImages[3],
      image1: savedImages[0],
      image2: savedImages[1],
      image3: savedImages[2],
      image4: savedImages[3],
      image5: savedImages[4],
      logo: savedLogo,
      smallLogo: savedSmallLogo
    };

    // console.log('Adding mission mobile item to the database...');
    await addMissionMobileItem(missionMobileItem);
    // console.log('Mission mobile item added successfully:', missionMobileItem);

    return NextResponse.json({
      success: true,
      message: 'Mission mobile item added successfully!',
      data: missionMobileItem,
    });
  } catch (error) {
    console.error('Error saving images or item:', error);
    return NextResponse.json({ success: false, message: 'Failed to save the images or item' }, { status: 500 });
  }
};
