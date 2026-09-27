import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

import { app } from "./firebase-config.js";


/* =====================================================
   FIREBASE
===================================================== */

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


/* =====================================================
   CONFIG
===================================================== */

const ADMIN_EMAIL =
  "digiprofilesweb@gmail.com";

const WORKS_COLLECTION =
  "digiprofiles_works";

const STORAGE_ROOT =
  "digiprofiles/work";


/* =====================================================
   ADMIN LOGIN
===================================================== */

export async function adminLogin(
  email,
  password
) {

  const cleanEmail =
    email.trim().toLowerCase();


  if (
    cleanEmail !== ADMIN_EMAIL
  ) {

    throw new Error(
      "This account is not authorized as DigiProfiles admin."
    );

  }


  const result =
    await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );


  console.log(
    "DigiProfiles LOGIN SUCCESS:",
    result.user.email
  );


  return result.user;

}


/* =====================================================
   LOGOUT
===================================================== */

export async function adminLogout() {

  await signOut(auth);

}


/* =====================================================
   AUTH STATE
===================================================== */

export function watchAdminAuth(
  callback
) {

  return onAuthStateChanged(
    auth,
    user => {

      if (
        user &&
        user.email?.toLowerCase() === ADMIN_EMAIL
      ) {

        callback(user);

      } else {

        if (user) {

          signOut(auth);

        }

        callback(null);

      }

    }
  );

}


/* =====================================================
   ADMIN CHECK
===================================================== */

function requireAdmin() {

  const user =
    auth.currentUser;


  if (!user) {

    throw new Error(
      "Admin login required."
    );

  }


  if (
    user.email?.toLowerCase() !== ADMIN_EMAIL
  ) {

    throw new Error(
      "You are not authorized."
    );

  }


  return user;

}


/* =====================================================
   GET NAME FROM WEBSITE URL
===================================================== */

function createNameFromUrl(
  websiteUrl
) {

  try {

    const url =
      new URL(websiteUrl);


    /*
      Example:

      advocate-dilip-prajapat.digiprofiles.in

      becomes:

      Advocate Dilip Prajapat
    */

    let hostname =
      url.hostname
        .toLowerCase();


    const parts =
      hostname.split(".");


    let namePart = "";


    /*
      DigiProfiles subdomain
    */

    if (
      hostname.endsWith(
        ".digiprofiles.in"
      ) &&
      parts.length >= 3
    ) {

      namePart =
        parts[0];

    } else {

      /*
        For another domain,
        use hostname without www.
      */

      namePart =
        hostname
          .replace(
            /^www\./,
            ""
          )
          .split(".")[0];

    }


    if (!namePart) {

      return "Website";

    }


    return namePart
      .replace(
        /[-_]+/g,
        " "
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim()
      .split(" ")
      .map(
        word =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");

  } catch (error) {

    return "Website";

  }

}


/* =====================================================
   ADD WORK
===================================================== */

export async function addWorkItem({

  description = "",

  profileLink,

  file = null

}) {

  requireAdmin();


  const cleanDescription =
    description.trim();


  const cleanLink =
    profileLink.trim();


  /* =================================================
     VALIDATE LINK
  ================================================= */

  if (!cleanLink) {

    throw new Error(
      "Website Link required hai."
    );

  }


  if (
    !/^https?:\/\//i.test(
      cleanLink
    )
  ) {

    throw new Error(
      "Website Link https:// ya http:// se start hona chahiye."
    );

  }


  /* =================================================
     AUTOMATIC NAME
  ================================================= */

  const title =
    createNameFromUrl(
      cleanLink
    );


  /* =================================================
     CREATE FIRESTORE DOCUMENT
  ================================================= */

  const workRef =
    await addDoc(
      collection(
        db,
        WORKS_COLLECTION
      ),
      {

        title,

        description:
          cleanDescription,

        profileLink:
          cleanLink,

        imageUrl:
          "",

        imagePath:
          "",

        active:
          true,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()

      }
    );


  /* =================================================
     IMAGE UPLOAD
  ================================================= */

  if (file) {

    const extension =
      getFileExtension(
        file.name
      );


    const storagePath =
      `${STORAGE_ROOT}/${workRef.id}.${extension}`;


    const storageRef =
      ref(
        storage,
        storagePath
      );


    await uploadBytes(
      storageRef,
      file
    );


    const imageUrl =
      await getDownloadURL(
        storageRef
      );


    await updateDoc(
      workRef,
      {

        imageUrl,

        imagePath:
          storagePath,

        updatedAt:
          serverTimestamp()

      }
    );

  }


  return {

    id:
      workRef.id,

    title,

    description:
      cleanDescription,

    profileLink:
      cleanLink

  };

}


/* =====================================================
   LOAD ALL WORK
===================================================== */

export async function loadAllWork() {

  requireAdmin();


  const snapshot =
    await getDocs(
      collection(
        db,
        WORKS_COLLECTION
      )
    );


  const works =
    snapshot.docs.map(
      item => ({

        id:
          item.id,

        ...item.data()

      })
    );


  works.sort(
    (a, b) => {

      const aTime =
        getTimestampValue(
          a.createdAt
        );

      const bTime =
        getTimestampValue(
          b.createdAt
        );


      return bTime - aTime;

    }
  );


  return works;

}


/* =====================================================
   GET ONE WORK
===================================================== */

export async function getWorkItem(
  workId
) {

  requireAdmin();


  const workRef =
    doc(
      db,
      WORKS_COLLECTION,
      workId
    );


  const snapshot =
    await getDoc(
      workRef
    );


  if (!snapshot.exists()) {

    return null;

  }


  return {

    id:
      snapshot.id,

    ...snapshot.data()

  };

}


/* =====================================================
   UPDATE WORK
===================================================== */

export async function updateWorkItem(
  workId,
  data
) {

  requireAdmin();


  const updateData = {};


  if (
    typeof data.description ===
    "string"
  ) {

    updateData.description =
      data.description.trim();

  }


  if (
    typeof data.profileLink ===
    "string"
  ) {

    const link =
      data.profileLink.trim();


    if (
      !/^https?:\/\//i.test(
        link
      )
    ) {

      throw new Error(
        "Website Link https:// ya http:// se start hona chahiye."
      );

    }


    updateData.profileLink =
      link;


    /*
      Link change hone par
      name bhi automatically update.
    */

    updateData.title =
      createNameFromUrl(
        link
      );

  }


  updateData.updatedAt =
    serverTimestamp();


  await updateDoc(
    doc(
      db,
      WORKS_COLLECTION,
      workId
    ),
    updateData
  );

}


/* =====================================================
   DELETE WORK
===================================================== */

export async function deleteWorkItem(
  workId
) {

  requireAdmin();


  const work =
    await getWorkItem(
      workId
    );


  if (!work) {

    throw new Error(
      "Work not found."
    );

  }


  /* Delete image */

  if (
    work.imagePath
  ) {

    await deleteStorageFile(
      work.imagePath
    );

  }


  /* Delete document */

  await deleteDoc(
    doc(
      db,
      WORKS_COLLECTION,
      workId
    )
  );

}


/* =====================================================
   DELETE STORAGE FILE
===================================================== */

async function deleteStorageFile(
  path
) {

  if (!path) {

    return;

  }


  try {

    const storageRef =
      ref(
        storage,
        path
      );


    await deleteObject(
      storageRef
    );


  } catch (error) {

    console.warn(
      "Storage file delete skipped:",
      path
    );

  }

}


/* =====================================================
   FILE EXTENSION
===================================================== */

function getFileExtension(
  filename
) {

  const parts =
    filename.split(".");


  if (
    parts.length < 2
  ) {

    return "jpg";

  }


  const extension =
    parts
      .pop()
      .toLowerCase()
      .replace(
        /[^a-z0-9]/g,
        ""
      );


  return extension || "jpg";

}


/* =====================================================
   TIMESTAMP
===================================================== */

function getTimestampValue(
  timestamp
) {

  if (!timestamp) {

    return 0;

  }


  if (
    typeof timestamp.toMillis ===
    "function"
  ) {

    return timestamp.toMillis();

  }


  if (
    typeof timestamp.seconds ===
    "number"
  ) {

    return (
      timestamp.seconds * 1000
    );

  }


  return 0;

}