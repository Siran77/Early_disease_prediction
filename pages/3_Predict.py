import streamlit as st
import tensorflow as tf
from PIL import Image
import numpy as np
from streamlit_option_menu import option_menu


disease_info = {
    'Darier_s disease': {
        'prevention': [
            "- Do consult a dermatologist for diagnosis and treatment.",
            "- Management may include topical medications, oral retinoids, or other therapies based on the severity of the condition."
        ],
        'chain_of_diseases': [
            "- Secondary bacterial infections due to skin lesions.",
            "- Eczema or dermatitis from skin irritation."
        ]
    },
    'Muehrck-e_s lines': {
        'prevention': [
            "- Consult a healthcare provider to identify the underlying cause.",
            "- Management focuses on addressing the underlying condition or cause."
        ],
        'additional_info': [
            "Muehrck-e_s lines are often associated with chronic hypoalbuminemia (low protein levels)."
        ],
        'chain_of_diseases': [
            "- Liver disease, such as cirrhosis.",
            "- Kidney disease due to fluid imbalance.",
            "- Protein-losing enteropathy (leading to low protein levels)."
        ]
    },
    'eczema': {
        'prevention': [
            "Follow your dermatologist's recommended treatment plan, which may include:",
            "- Using moisturizers regularly.",
            "- Applying topical corticosteroids or immunomodulators.",
            "- Avoiding triggers like certain soaps or allergens.",
            "- Don’t scratch the affected areas, as it can exacerbate the condition."
        ],
        'chain_of_diseases': [
            "- Asthma or allergic rhinitis (due to the atopic triad).",
            "- Secondary skin infections (e.g., bacterial or viral).",
            "- Chronic skin conditions leading to thickened or leathery skin."
        ]
    },
    'half and half nails (Lindsay_s nails)': {
        'prevention': [
            "- Consult with a healthcare professional for proper evaluation and diagnosis.",
            "- The cause of the nail discoloration should be determined to guide treatment."
        ],
        'chain_of_diseases': [
            "- Chronic kidney disease.",
            "- Hepatitis or other liver diseases."
        ]
    },
    'leukonychia': {
        'prevention': [
            "- Seek medical advice if you have leukonychia, as it can be related to various causes including trauma or fungal infections.",
            "- Treatment depends on the underlying cause, such as antifungal therapy for fungal infections."
        ],
        'chain_of_diseases': [
            "- Systemic diseases such as liver cirrhosis or renal failure.",
            "- Zinc deficiency."
        ]
    },
    'koilonychia': {
        'prevention': [
            "- See a doctor for a diagnosis and management, as it may be related to iron deficiency anemia or other medical issues.",
            "- Addressing the underlying condition is crucial. Iron supplements may be prescribed."
        ],
        'chain_of_diseases': [
            "- Iron deficiency anemia.",
            "- Hemochromatosis (iron overload).",
            "- Cardiac issues related to chronic anemia."
        ]
    },
    'splinter hemorrhage': {
        'prevention': [
            "- Consult a healthcare professional for proper evaluation, as it can be related to various medical conditions.",
            "- Treatment is based on addressing the underlying cause, which may involve managing infections or other health issues."
        ],
        'chain_of_diseases': [
            "- Endocarditis (infection of the heart lining).",
            "- Vasculitis or autoimmune conditions (e.g., lupus)."
        ]
    },
    'red lunula': {
        'prevention': [
            "- Seek medical advice if you notice red lunula, as it can indicate underlying health problems.",
            "- Management involves identifying and treating the underlying condition."
        ],
        'chain_of_diseases': [
            "- Rheumatoid arthritis.",
            "- Cardiovascular disease."
        ]
    },
    'onycholysis': {
        'prevention': [
            "Follow your dermatologist's recommended treatment plan, which may include:",
            "- Avoid activities that may worsen onycholysis, such as exposing your nails to moisture for extended periods."
        ],
        'chain_of_diseases': [
            "- Psoriasis (often seen in association).",
            "- Thyroid disorders."
        ]
    },
    'pale nail': {
        'prevention': [
            "- Consult a healthcare provider to determine the cause of pale nails, as it may be due to anemia or other medical issues.",
            "- Treatment should address the underlying cause, which may include iron supplements or other interventions."
        ],
        'chain_of_diseases': [
            "- Anemia (due to various causes such as iron deficiency or chronic disease).",
            "- Heart failure."
        ]
    },
    'terry_s nail': {
        'prevention': [
            "- See a doctor for a proper diagnosis, as Terry's nails can be a sign of liver or kidney disease.",
            "- Managing the underlying health condition is the primary focus."
        ],
        'chain_of_diseases': [
            "- Liver cirrhosis.",
            "- Chronic kidney disease.",
            "- Congestive heart failure."
        ]
    },
    'white nail': {
        'prevention': [
            "- Consult a healthcare provider if you have white nails, as it can be associated with several conditions, including liver disease.",
            "- Treatment should target the underlying cause, which may include addressing liver issues or other health problems."
        ],
        'chain_of_diseases': [
            "- Liver failure.",
            "- Nephrotic syndrome."
        ]
    },
    'yellow nails': {
        'prevention': [
            "- Seek medical advice if you have yellow nails, as it can be caused by fungal infections or other health issues.",
            "- Management may involve antifungal treatment or addressing underlying health concerns."
        ],
        'chain_of_diseases': [
            "- Respiratory issues, such as chronic bronchitis or sinusitis (Yellow Nail Syndrome).",
            "- Lymphedema (swelling due to lymphatic obstruction)."
        ]
    },
    'clubbing': {
        'prevention': [
            "- Seek medical evaluation if you notice clubbing of the fingers, as it can be a sign of various underlying conditions such as lung or heart disease.",
            "- Management focuses on treating the underlying cause."
        ],
        'chain_of_diseases': [
            "- Lung diseases, including lung cancer or chronic lung infections.",
            "- Congenital heart disease."
        ]
    },
    'bluish nail': {
        'prevention': [
            "- Consult a doctor if you have bluish nails, as it may indicate poor oxygenation or circulation problems.",
            "- Treatment depends on the underlying cause and may include addressing respiratory or cardiac issues."
        ],
        'chain_of_diseases': [
            "- Chronic obstructive pulmonary disease (COPD).",
            "- Heart failure or congenital heart defects."
        ]
    },
    'beau_s lines': {
        'prevention': [
            "- Seek medical attention if you notice Beau's lines, as they can indicate underlying health issues like infection, trauma, or systemic diseases.",
            "- The underlying cause should be treated to resolve the lines."
        ],
        'chain_of_diseases': [
            "- Systemic infections (such as measles or pneumonia).",
            "- Metabolic disorders, including uncontrolled diabetes."
        ]
    },
    'aloperia areata': {
        'prevention': [
            "- Consult with a dermatologist for diagnosis and treatment options.",
            "- Treatment may include corticosteroid injections, topical treatments, or immunotherapy.",
            "- Consider support groups or counseling for emotional well-being."
        ],
        'chain_of_diseases': [
            "- Autoimmune disorders like lupus or rheumatoid arthritis.",
            "- Thyroid disease (Hashimoto’s or Graves’)."
        ]
    }
}

model = tf.keras.models.load_model('pages/vgg-16-nail.h5')
st.set_page_config(
    page_title="Disease Prediction Model",
    layout="centered"
)

# Add custom CSS for styling the app
st.markdown("""
    <style>
    body {
        background-color: #f0f2f6;
    }
    .header {
        font-size: 30px;
        font-weight: bold;
        color: #4CAF50;
        text-align: center;
        margin-top: 20px;
    }
    .subheader {
        font-size: 24px;
        font-weight: bold;
        color: #FF6347;
        text-align: center;
        margin-top: 10px;
    }
    .prevention {
        font-size: 18px;
        color: #0066cc;
        margin-bottom: 10px;
    }
    .result {
        font-size: 28px;
        font-weight: bold;
        color: #e74c3c;
        text-align: center;
        margin: 20px 0;
    }
    </style>
""", unsafe_allow_html=True)

# Title and header
st.markdown('<p class="header"> Nail Disease Prediction Model </p>', unsafe_allow_html=True)

# Create a file uploader widget for users to upload nail images
uploaded_file = st.file_uploader("Upload an image of your nail to predict the disease", type=["jpg", "png", "jpeg"])

# Label dictionary for model predictions
label_dict = {
    0: 'Darier_s disease',
    1: 'Muehrck-e_s lines',
    2: 'aloperia areata',
    3: 'beau_s lines',
    4: 'bluish nail',
    5: 'clubbing',
    6: 'eczema',
    7: 'half and half nailes (Lindsay_s nails)',
    8: 'koilonychia',
    9: 'leukonychia',
    10: 'onycholycis',
    11: 'pale nail',
    12: 'red lunula',
    13: 'splinter hemorrhage',
    14: 'terry_s nail',
    15: 'white nail',
    16: 'yellow nails'
}

# Image processing and prediction logic
if uploaded_file is not None:
    image = Image.open(uploaded_file)
    image = image.resize((224, 224))  # Resize to match the input size of your model
    image = image.convert("RGB")
    image = np.array(image) / 255.0  # Normalize image
    image = np.expand_dims(image, axis=0)  # Expand dims for model input

    # Get classification result
    classification_result = model.predict([image])
    result = label_dict[np.argmax(classification_result)]

    # Display the uploaded image
    st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)

    # Display the classification result
    st.markdown(f'<p class="result">🩺 Classification Result: {result} 🩺</p>', unsafe_allow_html=True)

    # Display prevention steps if available
    if result in disease_info:
        st.markdown('<p class="subheader">🛡️ Prevention Steps:</p>', unsafe_allow_html=True)
        for step in disease_info[result]['prevention']:
            st.markdown(f'<p class="prevention">{step}</p>', unsafe_allow_html=True)
        
        # Display chain of diseases if available
        if 'chain_of_diseases' in disease_info[result]:
            st.markdown('<p class="subheader">🧬 Future Risk Factors:</p>', unsafe_allow_html=True)
            for chain in disease_info[result]['chain_of_diseases']:
                st.markdown(f'<p class="prevention">{chain}</p>', unsafe_allow_html=True)
    else:
        st.warning("Prevention steps information not available for this disease.")

    st.markdown("<hr>", unsafe_allow_html=True)
    st.info("It is recommended to consult with a healthcare professional for further evaluation and diagnosis.")
else:
    st.markdown('<p class="subheader">Please upload an image to predict the disease.</p>', unsafe_allow_html=True)