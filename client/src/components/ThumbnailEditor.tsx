import React, { useMemo } from 'react';
import { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import styles from '../styles/ThumbnailEditor.module.scss';

export default function ThumbnailEditor({
    sourceImageUrl,
    setThumbnailImageBlob,
    closeDialog
}: {
    sourceImageUrl: string,
    setThumbnailImageBlob: (imageBlob: Blob) => void,
    closeDialog: () => void
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | undefined>();

    const croppedImageUrl = useMemo(() => {
        return croppedImageBlob !== undefined ? URL.createObjectURL(croppedImageBlob) : undefined;
    }, [croppedImageBlob]);

    const onCropChange = useCallback((location: Point) => {
        setCrop(location);
    }, [setCrop]);

    const onZoomChange = useCallback((zoom: number) => {
        setZoom(zoom);
    }, [setZoom]);

    const onCropComplete = useCallback(async (_: Area, croppedAreaPixels: Area) => {
        if (sourceImageUrl !== undefined) {
            setCroppedImageBlob(await getCroppedImg(sourceImageUrl, croppedAreaPixels) ?? undefined);
        }
    }, [setCroppedImageBlob, sourceImageUrl]);

    const setThumbnailAndClose = useCallback(() => {
        if (croppedImageBlob !== undefined) {
            setThumbnailImageBlob(croppedImageBlob);
        }
        closeDialog();
    }, [croppedImageBlob, closeDialog, setThumbnailImageBlob]);

    return (
        <React.Fragment>
            <div className={styles.thumbnailDialog}>
                <div className={styles.cropperContainer}>
                    <Cropper
                        image={sourceImageUrl}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className={styles.dialogContent}>
                    {croppedImageUrl && (
                        <div>
                            <div>{`Thumbnail Preview: `}</div>
                            <img className={styles.tempImage} src={croppedImageUrl} />
                        </div>
                    )}
                    <div className={styles.dialogButtonsContainer}>
                        <button className={styles.editDialogSaveButton} onClick={closeDialog}>{`Cancel`}</button>
                        <button className={styles.editDialogSaveButton} onClick={setThumbnailAndClose}>
                            {`Save Thumbnail`}
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export function createImage(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.src = url;
    });
}

export async function getCroppedImg(
    imageSrc: string,
    croppedArea: Area,
) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
        return undefined;
    }

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);
  
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');
  
    if (!croppedCtx) {
        return undefined;
    }

    croppedCanvas.width = croppedArea.width;
    croppedCanvas.height = croppedArea.height;

    croppedCtx.drawImage(
        canvas,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        croppedArea.width,
        croppedArea.height
    );

    return new Promise<Blob | undefined>((resolve) => {
        croppedCanvas.toBlob((blob) => {
            if (blob !== null) {
                resolve(blob);
            } else {
                resolve(undefined);
            }
        }, 'image/jpeg');
    });
  }