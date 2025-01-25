import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { getAllMissionItems, addMissionItem } from '../../../lib/mission';

const UPLOAD_DIR = path.resolve(process.cwd(), 'public/uploads/mission');

export const GET = async (req) => {
  try {
    const items = await getAllMissionItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch mission items' }, { status: 500 });
  }
};

export const POST = async (req) => {
    const formData = await req.formData();
  
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
  
    // Validate inputs
    if (
      !pioneerTitle || !pioneerSubtitle || 
      !imageTitle1 || !imageTitle2 || !imageTitle3 || !imageTitle4 || !imageTitle5 ||
      !smallImage1 || !smallImage2 || !smallImage3 || !smallImage4 ||
      !image1 || !image2 || !image3 || !image4 || !image5
    ) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
  
    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  
    // Generate timestamp to add to filenames for uniqueness
    const timestamp = Date.now();

    // Save all image files with timestamped names
    const saveImage = async (image, namePrefix) => {
      const imageExtension = path.extname(image.name);
      const imageName = `${path.basename(image.name, imageExtension)}_${namePrefix}_${timestamp}${imageExtension}`;
      const imagePath = path.join(UPLOAD_DIR, imageName);
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      fs.writeFileSync(imagePath, imageBuffer);
      return `/uploads/mission/${imageName}`;
    };

    try {
      const savedSmallImages = await Promise.all([
        saveImage(smallImage1, 'small1'),
        saveImage(smallImage2, 'small2'),
        saveImage(smallImage3, 'small3'),
        saveImage(smallImage4, 'small4')
      ]);

      const savedImages = await Promise.all([
        saveImage(image1, 'image1'),
        saveImage(image2, 'image2'),
        saveImage(image3, 'image3'),
        saveImage(image4, 'image4'),
        saveImage(image5, 'image5')
      ]);

      const missionItem = {
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
      };
  
      // Save mission item details using addMissionItem
      await addMissionItem(missionItem);
  
      return NextResponse.json({
        success: true,
        message: 'Mission item added successfully!',
        data: missionItem,
      });
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Failed to save the images or item' }, { status: 500 });
    }
};
