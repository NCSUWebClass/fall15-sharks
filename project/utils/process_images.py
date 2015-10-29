from __future__ import division, print_function

import os
import cv2
import math
import argparse
import numpy as np


DEBUG = False
VERBOSE = False


class Colors:
    BLACK = (0, 0, 0)
    BLUE = (255, 0, 0)
    GREEN = (0, 255, 0)
    RED = (0, 0, 255)
    WHITE = (255, 255, 255)


class ToothPic:

    """ Lame pun
    """

    def __init__(self, src, dest):
        self.path = src
        self.image = cv2.imread(src)

        self.debug_imgs = {"debug": self.image.copy()}

        self.measurement = self.measure()
        # self.save_img()

        if DEBUG:
            for name, img in self.debug_imgs.items():
                cv2.imshow(name, img)

            cv2.waitKey(-1)
            cv2.destroyAllWindows()

    def get_tooth_contour(self):
        """ Get the tooth contour
        """
        hsv_img = cv2.cvtColor(self.image, cv2.COLOR_BGR2HSV)
        hue, sat, val = cv2.split(hsv_img)

        # Threshold (binary inverse) the image to kill anything brighter than a threshold of 225
        ret, thresh = cv2.threshold(val, 225, 255, cv2.THRESH_BINARY_INV)

        img = thresh.copy()

        # Erode + Dilate
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        img = cv2.erode(img, kernel)
        img = cv2.dilate(img, kernel)

        # Find contours in the image
        _, contours, hierarchy = cv2.findContours(img.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # The largest contour is the tooth
        tooth_contour = max(contours, key=lambda x: cv2.contourArea(x))

        if DEBUG and VERBOSE and len(contours) > 0:

            self.debug_imgs["tooth"] = img
            cv2.drawContours(self.debug_imgs["tooth"], [tooth_contour], 0, (255, 255, 0), -1)

        return tooth_contour

    def get_scale(self):
        """ Return the number of pixels per millimeter
        """
        hsv_img = cv2.cvtColor(self.image, cv2.COLOR_BGR2HSV)
        hue, sat, val = cv2.split(hsv_img)

        # Threshold (binary inverse) the image to kill anything with saturation less than 160
        ret, thresh = cv2.threshold(sat, 160, 255, cv2.THRESH_BINARY)

        img = thresh

        # Erode + Dilate
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        img = cv2.erode(img, kernel)
        img = cv2.dilate(img, kernel)

        # Find contours in the image
        _, contours, hierarchy = cv2.findContours(img.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        pixels = 104  # Seems to be a good default value

        # Some pictures don't have the scale...
        if len(contours) > 0:
            # The largest contour is the tooth
            scale_contour = max(contours, key=lambda x: cv2.contourArea(x))

            # Get the bounding rectangle of the scale contour
            (x, y, w, h) = cv2.boundingRect(scale_contour)

            # Get whichever measurement (width, height) of the bounding rectangle is larger.  Offset is to
            # better approximate the center of the handles, as opposed to the edge
            pixels = max(w, h) - 6

        if DEBUG:

            if len(contours) > 0:
                # Draw the left and right points onto the debug image, again using the offsets
                left = (int(x) + 3, int(y) + int(h / 2))
                right = (int(x + w) - 3, int(y) + int(h / 2))

                cv2.circle(self.debug_imgs["debug"], left, 4, Colors.BLACK, -1)
                cv2.circle(self.debug_imgs["debug"], right, 4, Colors.BLACK, -1)

                if VERBOSE:
                    self.debug_imgs["scale"] = img
                    cv2.drawContours(self.debug_imgs["scale"], [scale_contour], 0, (255, 255, 0), -1)

        return pixels

    def measure(self):
        """ Measure the tooth using the scale in the picture
        """
        tooth_contour = self.get_tooth_contour()
        scale = self.get_scale()

        def tooth_round(pix_diam, scale, alpha=.15):
            raw_diam = pix_diam / scale

            lower_bound = int(math.floor(raw_diam))
            upper_bound = int(math.ceil(raw_diam))

            if raw_diam - lower_bound < alpha:
                return lower_bound

            return upper_bound

        # Find the minimum enclosing circle
        (x, y), pix_radius = cv2.minEnclosingCircle(tooth_contour)

        # Cast the center and radius to integers
        center = (int(x), int(y))
        pix_radius = int(pix_radius * .97)  # account for an innacuracy in the minEnclosingCircle algorithm
        pix_diam = 2 * pix_radius

        measurement = tooth_round(pix_diam, scale)

        if DEBUG:

            # cv2.line(self.image, (center[0] - radius, center[1]), (center[0] + radius, center[1]), (0, 0, 255), 4)

            if VERBOSE:
                # Draw the outline of the tooth contour
                cv2.drawContours(self.debug_imgs["debug"], [tooth_contour], 0, Colors.RED, 3)

                # Draw all measurement circles
                for i in range(0, 15):
                    cv2.circle(self.debug_imgs["debug"], center, int(i / 2 * scale), Colors.BLUE, 4)

            # Write the measurement to the center of the image
            cv2.putText(self.debug_imgs["debug"], str(measurement),  (center[0], center[1]), cv2.FONT_HERSHEY_SIMPLEX, 1, Colors.GREEN, 3)

            # Draw the minimum enclosing circle
            cv2.circle(self.debug_imgs["debug"], center, pix_radius, Colors.RED, 4)

            # Draw the *actual* circle that it fits into
            cv2.circle(self.debug_imgs["debug"], center, int(measurement / 2 * scale), Colors.GREEN, 4)

            # Draw the circle 1 size smaller than the actual size
            cv2.circle(self.debug_imgs["debug"], center, int((measurement - 1) / 2 * scale), Colors.BLUE, 4)

        return measurement

    def save_img(self, path):
        """
        """
        pass

    def key_and_resize(self):
        """
        """
        # Draw a white mask in the shape of the tooth contour
        rows, cols, channels = self.image.shape
        mask = np.zeros((rows, cols, 1), np.uint8)
        cv2.drawContours(mask, [self.get_tooth_contour()], 0, 255, -1)

        # Erode + Dilate
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        mask = cv2.erode(mask, kernel)

        # Inverse of the mask
        mask_inv = cv2.bitwise_not(mask)

        tooth_img = cv2.bitwise_and(self.image, self.image, mask=mask)

        return tooth_img


def list_images(src):
    """ Returns the paths of all of the images in the
    """
    base_dir = os.getcwd()
    directory = os.path.join(base_dir, src)

    paths = [os.path.join(directory, image) for image in os.listdir(directory)]
    return paths


def main(src, dest):
    # List of paths to all of the images
    imgs = list_images(src)

    # Make the destination directory if it doesn't exist
    if os.path.exists(dest):
        if os.path.isfile(dest):
            print("Destination is not a directory")
            exit()

        if os.listdir(dest):
            print("Destination directory not empty")
            exit()
    else:
        os.mkdir(dest)

    # Create a ToothPic object for each image
    toothpics = [ToothPic(img, dest) for img in imgs]

    for pic in toothpics:
        pic.save_img(dest)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='CitizenScience Image Processor')

    parser.add_argument('source')
    parser.add_argument('destination')

    parser.add_argument('--debug', '-d', action='store_true', help='debug flag')
    parser.add_argument('--verbose', '-v', action='store_true', help='verbose debugging flag')

    args = parser.parse_args()

    DEBUG = args.debug
    VERBOSE = args.verbose

    src = args.source
    dest = args.destination

    main(src, dest)
